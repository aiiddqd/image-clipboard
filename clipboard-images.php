<?php
/*
	Plugin Name: Clipboard Images
	Description: Support paste images from clipboard for posts & comments (based on filereader.js)
	Author: CasePress
	Version: 0.3
	Author URI: https://github.com/casepress/WordPress-Image-Clipboard
 */

class Clipboard_Images
{
	public function __construct()
	{
		add_action('admin_enqueue_scripts', array(&$this, 'admin_scripts'));
		add_action('wp_enqueue_scripts', array(&$this, 'frontend_scripts'));

		add_action('init', array(&$this, 'init'));

		add_action('wp_ajax_cbimages_save', array(&$this, 'save_image'));
		add_action('wp_ajax_nopriv_cbimages_save', array(&$this, 'save_image'));
	}
	public function frontend_scripts()
	{
		wp_enqueue_script('filereader.js', plugins_url("js/filereader.min.js", __FILE__), array('jquery'));
		wp_enqueue_script('cursor_position.js', plugins_url("js/cursor_position.js", __FILE__), array('jquery'));
		wp_enqueue_script('fronted-cb-images', plugins_url("js/fronted.js", __FILE__), array('filereader.js'));
		wp_localize_script('fronted-cb-images', 'cbimages', array('ajaxurl' => admin_url('admin-ajax.php')));  
		
	}
	public function admin_scripts()
	{
		wp_enqueue_script('filereader.js', plugins_url("js/filereader.min.js", __FILE__), array('jquery'));
		wp_enqueue_script('cursor_position.js', plugins_url("js/cursor_position.js", __FILE__), array('jquery'));
		wp_enqueue_script('admin-cb-images', plugins_url("js/admin.js", __FILE__), array('filereader.js'));
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
		echo json_encode(array('file' => $uploads['url'] .'/'. $filename));
		die();
	}
}

$clipboard_images = new Clipboard_Images();

