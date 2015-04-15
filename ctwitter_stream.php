<?

//
// A simple class to access the Twitter streaming API, with OAuth authentication
//
//	Mike (mike@mikepultz.com)
//
// Simple Example:
//
//	require 'ctwitter_stream.php';
//
//	$t = new ctwitter_stream();
//
//	$t->login('consumer_key', 'consumer secret', 'access token', 'access secret');
//
//	$t->start(array('facebook', 'fbook', 'fb'))
//
class ctwitter_stream
{
    private $m_oauth_consumer_key;
    private $m_oauth_consumer_secret;
    private $m_oauth_token;
    private $m_oauth_token_secret;

    private $m_oauth_nonce;
    private $m_oauth_signature;
    private $m_oauth_signature_method = 'HMAC-SHA1';
    private $m_oauth_timestamp;
    private $m_oauth_version = '1.0';

    public function __construct()
    {
        //
        // set a time limit to unlimited
        //
        set_time_limit(0);
    }

    //
    // set the login details
    //
    public function login($_consumer_key, $_consumer_secret, $_token, $_token_secret)
    {
        $this->m_oauth_consumer_key     = $_consumer_key;
        $this->m_oauth_consumer_secret  = $_consumer_secret;
        $this->m_oauth_token            = $_token;
        $this->m_oauth_token_secret     = $_token_secret;

        //
        // generate a nonce; we're just using a random md5() hash here.
        //
        $this->m_oauth_nonce = md5(mt_rand());

        return true;
    }

    //
    // process a tweet object from the stream
    //
    private function process_tweet(array $_data)
    {
        if ($_data['lang']=="en") {
            $output = '<tr><td><a href="http://twitter.com/'.$_data['user']['screen_name'].'" target="_blank">'.$_data['user']['screen_name'].'</a></td>';
            $output .= '<td>'.$_data['user']['name'].'</td>';
            $output .= '<td><a href="'.$_data['user']['url'].'" target="_blank">'.$_data['user']['url'].'</a></td>';
            $output .= '<td>'.$_data['user']['followers_count'].'</td>';
            $output .= '<td>'.$_data['user']['friends_count'].'</td>';
            $output .= '<td>'.$_data['text'].'</td>';
            $output .='<td><a href="javascript:void(0);" class="delete_row">Delete</a></td>';
            $output .= '<td>'.date('n/j g:i:s',strtotime($_data['created_at'])).'</td></tr>';

            if (ob_get_level() == 0) ob_start();
            echo $output;
            ob_flush();
            flush();
        }

        return true;
    }

    //
    // the main stream manager
    //
    public function start(array $_keywords)
    {
        while(1)
        {
            $fp = fsockopen("ssl://stream.twitter.com", 443, $errno, $errstr, 30);
            if (!$fp)
            {
                echo "ERROR: Twitter Stream Error: failed to open socket";
            } else
            {
                //
                // build the data and store it so we can get a length
                //
                $data = 'track=' . rawurlencode(implode($_keywords, ','));

                //
                // store the current timestamp
                //
                $this->m_oauth_timestamp = time();

                //
                // generate the base string based on all the data
                //
                $base_string = 'POST&' .
                    rawurlencode('https://stream.twitter.com/1.1/statuses/filter.json') . '&' .
                    rawurlencode('oauth_consumer_key=' . $this->m_oauth_consumer_key . '&' .
                        'oauth_nonce=' . $this->m_oauth_nonce . '&' .
                        'oauth_signature_method=' . $this->m_oauth_signature_method . '&' .
                        'oauth_timestamp=' . $this->m_oauth_timestamp . '&' .
                        'oauth_token=' . $this->m_oauth_token . '&' .
                        'oauth_version=' . $this->m_oauth_version . '&' .
                        $data);

                //
                // generate the secret key to use to hash
                //
                $secret = rawurlencode($this->m_oauth_consumer_secret) . '&' .
                    rawurlencode($this->m_oauth_token_secret);

                //
                // generate the signature using HMAC-SHA1
                //
                // hash_hmac() requires PHP >= 5.1.2 or PECL hash >= 1.1
                //
                $raw_hash = hash_hmac('sha1', $base_string, $secret, true);

                //
                // base64 then urlencode the raw hash
                //
                $this->m_oauth_signature = rawurlencode(base64_encode($raw_hash));

                //
                // build the OAuth Authorization header
                //
                $oauth = 'OAuth oauth_consumer_key="' . $this->m_oauth_consumer_key . '", ' .
                        'oauth_nonce="' . $this->m_oauth_nonce . '", ' .
                        'oauth_signature="' . $this->m_oauth_signature . '", ' .
                        'oauth_signature_method="' . $this->m_oauth_signature_method . '", ' .
                        'oauth_timestamp="' . $this->m_oauth_timestamp . '", ' .
                        'oauth_token="' . $this->m_oauth_token . '", ' .
                        'oauth_version="' . $this->m_oauth_version . '"';

                //
                // build the request
                //
                $request  = "POST /1.1/statuses/filter.json HTTP/1.1\r\n";
                $request .= "Host: stream.twitter.com\r\n";
                $request .= "Authorization: " . $oauth . "\r\n";
                $request .= "Content-Length: " . strlen($data) . "\r\n";
                $request .= "Content-Type: application/x-www-form-urlencoded\r\n\r\n";
                $request .= $data;

                //
                // write the request
                //
                fwrite($fp, $request);

                //
                // set it to non-blocking
                //
                stream_set_blocking($fp, 0);

                while(!feof($fp))
                {
                    $read   = array($fp);
                    $write  = null;
                    $except = null;

                    //
                    // select, waiting up to 10 minutes for a tweet; if we don't get one, then
                    // then reconnect, because it's possible something went wrong.
                    //
                    $res = stream_select($read, $write, $except, 600, 0);
                    if ( ($res == false) || ($res == 0) )
                    {
                        break;
                    }

                    //
                    // read the JSON object from the socket
                    //
                    $json = fgets($fp);

                    //
                    // look for a HTTP response code
                    //
                    if (strncmp($json, 'HTTP/1.1', 8) == 0)
                    {
                        $json = trim($json);
                        if ($json != 'HTTP/1.1 200 OK')
                        {
                            echo 'ERROR: ' . $json . "\n";
                            return false;
                        }
                    }

                    //
                    // if there is some data, then process it
                    //
                    if ( ($json !== false) && (strlen($json) > 0) )
                    {
                        //
                        // decode the socket to a PHP array
                        //
                        $data = json_decode($json, true);
                        if ($data)
                        {
                            //
                            // process it
                            //
                            if (is_array($data)) $this->process_tweet($data);
                        }
                    }
                }
            }

            fclose($fp);
            sleep(10);
        }

        return;
    }
};