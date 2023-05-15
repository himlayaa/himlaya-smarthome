package com.example.mpdemo.controller;
import com.alibaba.fastjson.JSONObject;
import com.example.mpdemo.entity.User;

import com.example.mpdemo.service.UserService;
import com.example.mpdemo.utils.JwtUtils;
import com.example.mpdemo.utils.Result;
import com.example.mpdemo.utils.WxUtils;
import com.example.mpdemo.utils.ipUtils;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;


@RestController
@RequestMapping("/user")
@CrossOrigin
public class UserController {
    public String appId = "wxf2b8b822068a0eda";
    public String secret = "4fa0b41508211933e470caca0779db97";
    @Autowired
    private UserService userService;

    @PostMapping("/login") //登录
    public Result login(@RequestBody User user, HttpServletRequest request) {
        System.out.println("UserController->login--> 开始运行...");
        System.out.println("UserController->login--> " + user);
        String token = JwtUtils.generateToken(user.getUsername() + "&" + user.getPassword()+"&" + user.getEmail());
        String[] u = JwtUtils.getClaimsByToken(token).getSubject().split("&");
        String username = u[0];
        String password = u[1];
        //String email = u[2];
        System.out.println("UserController->login--> username: " + username + " || password: " + password);

        String ipAddress = ipUtils.getIpAddr(request);
        System.out.println("访问ip地址为: -->"+ipAddress);

        int flag = userService.validateUser(user);
        if (flag == 2) {
            return Result.ok().data("token", token);
        } else if (flag == 1) {
            return Result.error().msg("密码错误！请重新输入");
        } else if (flag == 0) {
            //return Result.warn().msg("您是新用户，正在尝试为您注册");
            return Result.error().msg("没有用户信息，请注册!");

        }
        return Result.error().msg("出现严重错误，请关闭网页");
    }

    @PostMapping("/signup") //注册
    public Result signup(@RequestBody User user, HttpServletRequest request) {
        System.out.println("UserController->signup--> 开始运行...");
        System.out.println("UserController->signup--> " + user);
        String token = JwtUtils.generateToken(user.getUsername() + "&" + user.getPassword()+"&" + user.getEmail());
        String[] u = JwtUtils.getClaimsByToken(token).getSubject().split("&");
        String username = u[0];
        String password = u[1];
        System.out.println("UserController->signup--> username: " + username + " || password: " + password);

        String ipAddress = ipUtils.getIpAddr(request);
        System.out.println("访问ip地址为: -->"+ipAddress);

        int flag = userService.validateUser(user);
        if(flag == 1){
            System.out.println("UserController->signup->--> 用户已存在！");
            return Result.warn().msg("用户名已存在，请重试");
        }
        if (flag == 0) {
            if (userService.insertOne(user) == -1) {
                System.out.println("UserController->login->insert--> 失败！");
                return Result.warn().msg("注册出错，请重试");
            }
            //return Result.warn().msg("您是新用户，正在尝试为您注册");
            return Result.ok().data("token", token).msg("注册成功!");

        }
        return Result.error().msg("出现严重错误，请关闭网页");
    }


    @GetMapping("/info")
    public Result info(String token) {
        System.out.println("UserController->info--> 开始运行...");
        System.out.println("UserController->info--> " + token);

        String[] u = JwtUtils.getClaimsByToken(token).getSubject().split("&");
        String username = u[0];
        String password = u[1];
        System.out.println("UserController->info--> token信息--> username: " + username + " & password: " + password);

        User user = new User(username, password,null,null);
        int flag = userService.validateUser(user);
        if (flag == 2) {
            user = userService.selectById(userService.findid(user));
            System.out.println("UserController->info--> 返回前端的信息--> " + user);
            return Result.ok().data("username", user.getUsername()).data("password", user.getPassword()).data("avatar", user.getAvatar());
        }
        return Result.error().msg("用户校验失败，请重新登录");
    }

    @PostMapping("/logout")  // "token:xxx"
    public Result logout() {
        System.out.println("UserController->logout--> 开始运行...");
        return Result.ok();
    }

    @PostMapping("/forget")  // 忘记密码
    public Result forget(@RequestBody User user) {
        System.out.println("UserController->forget--> 开始运行...");
        System.out.println(user);
        int flag = userService.validateUserByNameAndEmail(user);
        if (flag == 2) {
            user = userService.selectById(userService.findid(user));
            user.setPassword("123456");//重置密码123456
            if (userService.updateById(user) != -1) {
                System.out.println("UserController->forget--> 重置密码成功...");
                return Result.ok().msg("修改成功");
            }
        }else if(flag == 1){
            return Result.error().msg("邮箱错误！");
        }
        return Result.error().msg("没有该用户！");
    }

    @PutMapping("/update")
    public Result updateOne(User user, HttpServletRequest request) {
        System.out.println("UserController->updateOne--> 开始运行...");
        System.out.println("UserController->updateOne--> " + user.getFile().getOriginalFilename());
        String ipAddress = ipUtils.getIpAddr(request);
        System.out.println(ipAddress);

        try {
            user.setAvatar(userService.getURL(userService.storeFile(user.getFile()), request));
            if (userService.updateById(user) != -1) {
                System.out.println("UserController->updateOne--> update成功");
                return Result.ok().data("username", user.getUsername()).data("password", user.getPassword()).data("avatar", user.getAvatar());
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("UserController->updateOne--> update失败！");
            return Result.error().msg("出现严重错误，请关闭网页");
        }

        return Result.warn().msg("图片上传成功，但表单上传失败");
    }

    @RequestMapping(value = "/test", method = RequestMethod.GET)
    public String test(HttpServletRequest request){
        //获取IP地址
        String ipAddress = ipUtils.getIpAddr(request);
        System.out.println(ipAddress);
        return ipAddress;
    }

    @RequestMapping(value = "/wxLogin",method = RequestMethod.POST)
    @ResponseBody
    public JSONObject wxLogin(@RequestBody User user,HttpServletRequest request){

        JSONObject object = new JSONObject();

            //User userinfo = new User(user.getUsername(), user.getPassword(),null,null);
        String ipAddress = ipUtils.getIpAddr(request);
        System.out.println("访问ip地址为: -->"+ipAddress);

            int flag = userService.validateUser(user);
            if(flag == 2) { //找到用户
                user = userService.selectById(userService.findid(user)); //将用户信息拿到
                object.put("code",200);
                object.put("msg","登录成功!");
                object.put("userInfo",user);
                return object;

            }else if (flag == 1) { //账号或密码错误
               object.put("code",201);
               object.put("msg","账号或密码错误，请重试!");
               return object;

            }else if (flag == 0) { //没有该用户
               object.put("code",201);
               object.put("msg","没有用户信息，请注册!");
               return object;
            }else {
                object.put("code",400);
                object.put("msg","出现严重错误!");
                return object;
            }
    }


    @RequestMapping(value = "/wxSignup",method = RequestMethod.POST) //处理微信注册
    @ResponseBody
    public JSONObject wxSignup(@RequestBody User user,HttpServletRequest request){

        JSONObject object = new JSONObject();

        int flag = userService.validateUser(user);
        if(flag == 1) { //找到用户
            user = userService.selectById(userService.findid(user)); //将用户信息拿到
            object.put("code",201);
            object.put("msg","当前用户已存在!");
            return object;

        }else if (flag == 0) { //没有该用户
            if (userService.insertOne(user) == -1) { //注册出错
                System.out.println("UserController->wxSignup->insert--> 失败！");
                object.put("code", 201);
                object.put("msg", "注册出错，请重试!");
                return object;
            }
            user = userService.selectById(userService.findid(user));
            object.put("code",200);
            object.put("msg","注册成功!");
            object.put("userInfo",user);
            return object;
        }else {
            object.put("code",400);
            object.put("msg","出现严重错误!");
            return object;
        }
    }



    @RequestMapping(value = "/wxForget",method = RequestMethod.POST)
    @ResponseBody
    public JSONObject wxForget(@RequestBody User user){
        JSONObject object = new JSONObject();
        //User userinfo = new User(user.getUsername(), user.getPassword(),null,null);
        int flag = userService.validateUserByNameAndEmail(user);

        if(flag == 2) { //找到用户
            user = userService.selectById(userService.findid(user)); //将用户信息拿到
            user.setPassword("123456");//重置密码123456
            if (userService.updateById(user) != -1) {
                System.out.println("UserController->forget--> 重置密码成功...");
                object.put("code", 200);
                object.put("msg", "重置成功!");
                object.put("userInfo", user);
                return object;
            }
        }else if(flag == 1){
            object.put("code", 201);
            object.put("msg", "邮箱错误!");
            return object;
        }
        object.put("code", 400);
        object.put("msg", "没有该用户!");
        return object;
    }
}
