package com.example.mpdemo.service;

import com.example.mpdemo.utils.WxUtils;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CityService {
//    public List<String> getCityId(){
//        return cityRepository.getCityId();
//    }
    public String getLongitudeAndLatitudeByApi(String api) {
        String key = "f7a68fd5fcea025368f9e507673de28f";
        String url = "https://restapi.amap.com/v5/ip?type=4&key=<" + key + ">&ip=" + api;
        return "s";
        //String dat = WxUtils.httpRequest(url, "get", )
    }

}
