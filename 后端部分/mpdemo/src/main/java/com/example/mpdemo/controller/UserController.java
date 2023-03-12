package com.example.mpdemo.controller;
import com.example.mpdemo.entity.User;

import com.example.mpdemo.service.UserService;
import com.example.mpdemo.utils.JwtUtils;
import com.example.mpdemo.utils.Result;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;


@RestController
@RequestMapping("/user")
@CrossOrigin
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/login") //登录与注册2合1
    public Result login(@RequestBody User user) {
        System.out.println("UserController->login--> 开始运行...");
        System.out.println("UserController->login--> " + user);
        String token = JwtUtils.generateToken(user.getUsername() + "&" + user.getPassword()+"&" + user.getEmail());
        String[] u = JwtUtils.getClaimsByToken(token).getSubject().split("&");
        String username = u[0];
        String password = u[1];
        //String email = u[2];
        System.out.println("UserController->login--> username: " + username + " || password: " + password);

        int flag = userService.validateUser(user);
        if (flag == 2) {
            return Result.ok().data("token", token);
        } else if (flag == 1) {
            return Result.error().msg("密码错误！请重新输入");
        } else if (flag == 0) {
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
    public Result select(@RequestBody User user) {
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
        }
        return Result.error().msg("查找用户失败，请重新确认信息");
    }

    @PutMapping("/update")
    public Result updateOne(User user, HttpServletRequest request) {
        System.out.println("UserController->updateOne--> 开始运行...");
        System.out.println("UserController->updateOne--> " + user.getFile().getOriginalFilename());

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
}



//    @PostMapping("/login")
//    @ApiOperation("用户登录：（1）功能：按手机号生成token。 1、登录成功返回token。 2、失败返回提示信息。3、第一次登录的手机号直接注册，并返回token； （2）参数：1、user（对象，json格式），必须含有手机号和密码")
//    public Result login(@RequestBody User user) {
//        System.out.println("UserController->login--> 开始运行...");
//        System.out.println("UserController->login--> " + user);
//
//        int flag =  userService.validateUser(user);
//        if (flag >= 5){
//            Result rs = Result.error();
//            if(flag==5){
//                return rs.data("msg","账号不能来个空的啊！");
//            }else if(flag == 6){
//                return rs.data("msg","密码是不是输入错误啦！！");
//            }
//        }
//        String token="";
//        try{
//            Map<String,String> payload =  new HashMap<>();
//            payload.put("username",user.getUsername());
//            //生成JWT的令牌
//            token = JwtUtils.getToken(payload);
//        }catch (Exception e){
//            return Result.error().data("msg","发生异常");
//        }
//        return Result.ok().data("token",token);
//    }

//    //获取用户参数：（1）功能：通过token获取用户信息；
//    @GetMapping("/info")
//    @ApiOperation("获取用户参数：（1）功能：通过请求头中的token获取用户信息;")
//    public Result userInfo(HttpServletRequest request) {
//        String token = request.getHeader("token");
//        DecodedJWT verify = JwtUtils.verify(token);
//        User user = userService.selectById(verify.getClaim("username").asInt());
//        return Result.ok().data("user", user);
//    }