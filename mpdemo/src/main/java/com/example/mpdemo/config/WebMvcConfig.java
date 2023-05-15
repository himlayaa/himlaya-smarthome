package com.example.mpdemo.config;

import org.apache.catalina.connector.Connector;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.servlet.server.ServletWebServerFactory;
import org.springframework.web.filter.CorsFilter;
import org.apache.tomcat.util.bcel.classfile.Constant;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {


    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        //为了静态资源不被拦截
        registry.addResourceHandler("/img/**").addResourceLocations("file:" + System.getProperty("user.dir") + "/src/main/resources/static/img/");
        registry.addResourceHandler("/avatar/**").addResourceLocations("file:" + System.getProperty("user.dir") + "/src/main/resources/static/avatar/");
    }


}


