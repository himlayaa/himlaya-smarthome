package com.example.mpdemo.service;

import com.alibaba.fastjson.JSONObject;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
@Service
public class HttpClient {
    public JSONObject client(String url, HttpMethod method, MultiValueMap<String,String> params){
        RestTemplate template=new RestTemplate();
        ResponseEntity<String> response1=template.getForEntity(url,String.class);
        return JSONObject.parseObject(response1.getBody()); //得到城市code
    }
}
