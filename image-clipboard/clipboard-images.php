<?php
/*
	Plugin Name: Clipboard Images
	Description: Support paste images from clipboard for posts & comments (based on filereader.js)
	Author: CasePress Studio
	Version: 1.0
	Author URI: https://github.com/casepress/WordPress-Image-Clipboard
 */

class Clipboard_Images
{
	public function __construct()
	{
		load_plugin_textdomain('ic', false, dirname( plugin_basename( __FILE__ ) ) . '/lang' );
		add_option('ic_comments', '1');
		add_option('ic_loader', '1');
		add_option('ic_dd', '1');
		
		add_action('admin_enqueue_scripts', array(&$this, 'admin_scripts'));
		add_action('wp_enqueue_scripts', array(&$this, 'frontend_scripts'));
		add_action('admin_enqueue_scripts', array(&$this, 'general_scripts'));
		add_action('wp_enqueue_scripts', array(&$this, 'general_scripts'));
		
		add_action('init', array(&$this, 'init'));

		add_action('wp_ajax_cbimages_save', array(&$this, 'save_image'));
		add_action('wp_ajax_nopriv_cbimages_save', array(&$this, 'save_image'));
		
		add_action('admin_menu',  array (&$this, 'options') );
		
		
	}
	
	public function options()
	{
		add_options_page(
			__('Image Clipboard Options Page', 'ic'), 
			__('Image Clipboard Options', 'ic'), 
			8, 
			basename(__FILE__), 
			array (&$this, 'options_page_render') 
		);
	}
	
	public function options_page_render()
	{
		$options = array();
		
		if ( isset($_POST['submit']) ) 
		{   
		   if ( function_exists('current_user_can') && 
				!current_user_can('manage_options') )
					die ( _e('Hacker?', 'ic') );

			if (function_exists ('check_admin_referer') )
			{
				check_admin_referer('ic_form');
			}

			$ic_comments = $_POST['ic_comments'];
			$ic_loader = $_POST['ic_loader'];
			$ic_dd = $_POST['ic_dd'];

			update_option('ic_comments', $ic_comments);
			update_option('ic_loader', $ic_loader);
			update_option('ic_dd', $ic_dd);
		
		}
		
		$options['comments'] = get_option('ic_comments');
		$options['loader'] = get_option('ic_loader');
		$options['dd'] = get_option('ic_dd');
		?>
		<div class='wrap'>
			<h2><?php _e('Image Clipboard Options', 'ic'); ?></h2>

			<form name="ic" method="post" 
				action="<?php echo $_SERVER['PHP_SELF']; ?>?page=clipboard-images.php&updated=true">

				<?php 
					if (function_exists ('wp_nonce_field') )
					{
						wp_nonce_field('ic_form'); 
					}
				?>

				<table class="form-table">
					<tr valign="top">
						<th scope="row"><?php _e('Enable image clipboard for comments:', 'ic'); ?></th>
						<td>
							<?php _e('Disable', 'ic'); ?> <input type="radio" name="ic_comments" value="0"<?php checked( '0', $options['comments'] ); ?>/>
							<?php _e('Enable', 'ic'); ?> <input type="radio" name="ic_comments" value="1"<?php checked( '1', $options['comments'] ); ?>/>
						</td>
					</tr>

					<tr valign="top">
						<th scope="row"><?php _e('Enable image clipboard progress bar:', 'ic'); ?></th>
						<td>
							<?php _e('Disable', 'ic'); ?> <input type="radio" name="ic_loader" value="0"<?php checked( '0', $options['loader'] ); ?>/>
							<?php _e('Enable', 'ic'); ?> <input type="radio" name="ic_loader" value="1"<?php checked( '1', $options['loader'] ); ?>/>
						</td>
					</tr>
					
					<tr valign="top">
						<th scope="row"><?php _e('Enable image clipboard drag&drop:', 'ic'); ?></th>
						<td>
							<?php _e('Disable', 'ic'); ?> <input type="radio" name="ic_dd" value="0"<?php checked( '0', $options['dd'] ); ?>/>
							<?php _e('Enable', 'ic'); ?> <input type="radio" name="ic_dd" value="1"<?php checked( '1', $options['dd'] ); ?>/>
						</td>
					</tr>
				</table>

				<input type="hidden" name="action" value="update" />

				<input type="hidden" name="page_options" 
					value="ic_comments,ic_loader" />

				<p class="submit">
				<input type="submit" name="submit" value="<?php _e('Save Changes') ?>" />
				</p>
			</form>
		</div>
		<?
	}
	
	public function frontend_scripts()
	{
		if (get_option('ic_comments') == 1){
			wp_enqueue_script('fronted-cb-images', plugins_url("js/fronted.js", __FILE__), array('filereader.js', 'ajaxq.js'));
		}
	}
	public function admin_scripts()
	{
		wp_enqueue_script('admin-cb-images', plugins_url("js/admin.js", __FILE__), array('filereader.js', 'ajaxq.js'));
	}
	
	public function general_scripts()
	{
		wp_enqueue_style('clipboard.css', plugins_url("css/clipboard.css", __FILE__));
		wp_enqueue_script('filereader.js', plugins_url("js/filereader.min.js", __FILE__), array('jquery'));
		wp_enqueue_script('clipboard-functions.js', plugins_url("js/functions.js", __FILE__), array('jquery'));
		wp_enqueue_script('ajaxq.js', plugins_url("js/ajaxq.js", __FILE__), array('jquery'));
		wp_localize_script('clipboard-functions.js', 'cbimages', array('ajaxurl' => admin_url('admin-ajax.php'), 'loading' => __('Loading', 'ic'), 'of' => __('of', 'ic'), 'loader' => get_option('ic_loader'), 'dd' => get_option('ic_dd'))); 
	}
	
	public function init()
	{
		
		add_filter('mce_external_plugins', array(&$this, 'mce_plugin'));
	}

	public function mce_plugin($plugins)
	{
		$plugins['cbimages'] = plugins_url("js/editor_plugin_src.js", __FILE__);
		return $plugins;
	}

	public function save_image()
	{
		$post_id = $_POST['post_id'];
		$img = $_POST['img'];
		$tmp_img = explode(";", $img);
		$img_header = explode('/', $tmp_img[0]);
		$ext = $img_header[1];

		$imgtitle = mt_rand(111,999);
		$imgtitle .= '.'.$ext;

		$uploads = wp_upload_dir($time = null); 
		$filename = wp_unique_filename($uploads['path'], $imgtitle);
		
		$image_url = $uploads['url'].'/'.$filename;
		
		file_put_contents($uploads['path'].'/'.$filename, file_get_contents('data://'.$img));
		
		$wp_filetype = wp_check_filetype($image_url);
		$attachment = array(
			'guid' => $image_url, 
			'post_mime_type' => $wp_filetype['type'],
			'post_title' => preg_replace('/\.[^.]+$/', '', basename($image_url)),
			'post_content' => '',
			'post_status' => 'inherit'
		);
		$attachment_id = wp_insert_attachment($attachment, $uploads['path'].'/'.$filename, $post_id);
		require_once(ABSPATH . 'wp-admin/includes/image.php');
		$attachment_data = wp_generate_attachment_metadata( $attachment_id, $uploads['path'].'/'.$filename );
		wp_update_attachment_metadata( $attachment_id, $attachment_data );
		die(json_encode(array('file' => $uploads['url'] .'/'. $filename)));
	}
}

$clipboard_images = new Clipboard_Images();

