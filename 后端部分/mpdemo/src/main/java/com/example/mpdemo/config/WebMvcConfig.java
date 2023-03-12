package com.example.mpdemo.config;

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
//    //注册拦截器
//    public void addInterceptors(InterceptorRegistry registry) {
//        registry.addInterceptor(new JWTInterceptor())
//                .addPathPatterns("/user/**","/column/**","/order/**","/product/**")   //其他接口token验证
//                .excludePathPatterns("/user/login");  //所有用户都放心
//    }

//    //解决跨域问题
//    @Bean
//    public FilterRegistrationBean corsFilter() {
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        CorsConfiguration config = new CorsConfiguration();
//        config.setAllowCredentials(true);
//        config.addAllowedOriginPattern("*");
//        config.addAllowedHeader("*");
//        config.addAllowedMethod("*");
//        source.registerCorsConfiguration("/**", config);
//        FilterRegistrationBean bean = new FilterRegistrationBean(new CorsFilter(source));
//        bean.setOrder(0);
//        return bean;
//    }
}


