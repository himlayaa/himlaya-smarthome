package com.example.mpdemo.controller;

import com.alibaba.fastjson.JSONObject;
import com.example.mpdemo.service.HttpClient;
import com.example.mpdemo.utils.WxUtils;
import com.example.mpdemo.utils.ipUtils;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping("/weather")
public class weatherController {
    @Autowired
    HttpClient httpClient;

    @RequestMapping(value = "/test", method = RequestMethod.GET)
    public String test(HttpServletRequest request){
        //获取IP地址
        String ipAddress = ipUtils.getIpAddr(request);

        return ipAddress;
    }

    @GetMapping("/getLatitude")  //得到城市code
    public JSONObject getLongitudeAndLatitudeByApi() {
        String api = "171.92.107.19";
        String key = "f7a68fd5fcea025368f9e507673de28f";
        String url = "https://restapi.amap.com/v3/ip?key=" + key + "&output=json&ip=" + api;
        HttpMethod method = HttpMethod.GET;
        MultiValueMap<String,String> params = new LinkedMultiValueMap<>();
        JSONObject obj = httpClient.client(url,method,params);
        System.out.println(obj);
        return obj;
    }


    @GetMapping("/get7w")  //7
    public JSONObject getweather() {
        //String url = "https://api.qweather.com/v7/weather/7d?";
        String key = "74477953f8864b31b61f258a2720705f";
        String full = "https://api.qweather.com/v7/weather/7d?key=74477953f8864b31b61f258a2720705f&location=101010100";
        String url = "https://api.qweather.com/v7/weather/7d?key=" + key + "&location=511700";
        HttpMethod method = HttpMethod.GET;
        MultiValueMap<String,String> params = new LinkedMultiValueMap<>();
        JSONObject obj = httpClient.client(full,method,params);
        System.out.println(obj);
        return obj;
    }

    //@RequestMapping(value = "/getWeather",method = RequestMethod.GET)
    @GetMapping("/getWeather")
    public String doGet(@RequestParam Map<String,String> paramsMap){
        //Map<String,String> paramsMap = new HashMap<>();
       // String url, Map<String,String> paramsMap
        String url = "https://devapi.qweather.com/v7/weather/7d?key=74477953f8864b31b61f258a2720705f";
        System.out.println(paramsMap.get("latitude"));
        String response = "";
        String p = "";

        if(paramsMap.size()>0){
            p ="&location="+paramsMap.get("longitude").toString() + "," + paramsMap.get("latitude").toString();
        }
        if(!p.equals("")){
            url = url + p;
        }
        System.out.println(url);
        CloseableHttpClient client = HttpClients.createDefault();
        HttpGet httpGet = new HttpGet(url);
        CloseableHttpResponse closeableHttpResponse = null;
        try{
            closeableHttpResponse = client.execute(httpGet);
            closeableHttpResponse.setStatusCode(2000);
            //closeableHttpResponse.setHeader("Access-Control-Allow-Origin", "*");
            HttpEntity entity = closeableHttpResponse.getEntity();
            response = EntityUtils.toString(entity, "UTF-8");
        }catch (Exception e ){
            //logger.error("网络通讯失败，url为："+url+",异常为："+e);
            System.out.println("网络通讯失败，url为："+url+",异常为："+e);
        }finally {
            try {
                closeableHttpResponse.close();
            } catch (IOException e) {
            }
        }
        System.out.println(response);
        return response ;
    }
}
