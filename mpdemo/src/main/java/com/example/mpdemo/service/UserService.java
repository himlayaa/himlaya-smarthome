package com.example.mpdemo.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.example.mpdemo.entity.User;
import com.example.mpdemo.mapper.smtuserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private smtuserMapper userMapper;

    public int insertOne(User user) {
        System.out.println("UserService->insertOne--> " + user + "将被插入数据库");
        return userMapper.insert(user);
    }

    public int validateUser(User user) {
        QueryWrapper<User> wrapper = new QueryWrapper();
        wrapper.eq("username", user.getUsername());
        User um = userMapper.selectOne(wrapper);
        //比较密码
        if (um == null) {
            System.out.println("UserService->validateUser--> " + user + "查无此用户");
            return 0;//没有这个用户
        } else if (!um.getPassword().equals(user.getPassword())) {
            System.out.println("UserService->validateUser--> " + user + "此用户存在，但密码错误");
            return 1;//密码不对
        }
        System.out.println("UserService->validateUser--> " + user + "用户密码匹配");
        return 2;//很对
    }

    public int validateUserByNameAndEmail(User user) {
        QueryWrapper<User> wrapper = new QueryWrapper();
        wrapper.eq("username", user.getUsername());
        User um = userMapper.selectOne(wrapper);
        //比较邮箱
        if (um == null) {
            System.out.println("UserService->validateUserByNameAndEmail--> " + user + "查无此用户");
            return 0;//没有这个用户
        } else if (!um.getEmail().equals(user.getEmail())) {
            System.out.println("UserService->validateUserByNameAndEmail--> " + user + "此用户存在，但邮箱地址错误");
            return 1;//邮箱不对
        }
        System.out.println("UserService->validateUserByNameAndEmail--> " + user + "账号邮箱匹配");
        return 2;//很对
    }

    public String storeFile(MultipartFile file) {
        System.out.println("UserService->storeFile--> " + file + " 开始运行存储程序...");
        String fileName = file.getOriginalFilename();
        Format dateFormat = new SimpleDateFormat("yyyy-MM-dd-");
        String format = dateFormat.format(new Date());
        String realPath = System.getProperty("user.dir") + "/src/main/resources/static/avatar";
        System.out.println("UserService->storeFile--> " + realPath + " 此位置将被用作存储，请检查");
        File folder = new File(realPath);
        if (!folder.exists()) {
            System.out.println("UserService->storeFile--> " + realPath + " 正在创建文件夹！");
            //若不存在该目录，则创建目录
            folder.mkdirs();
        }
        String newName;
        if (fileName.endsWith(".png") || fileName.endsWith(".PNG")) {
            newName = format + UUID.randomUUID().toString() + ".png";
        } else if (fileName.endsWith(".jpg") || fileName.endsWith(".JPG")) {
            newName = format + UUID.randomUUID().toString() + ".jpg";
        } else if (fileName.endsWith(".jpeg") || fileName.endsWith(".JPEG")) {
            newName = format + UUID.randomUUID().toString() + ".jpeg";
        } else {
            System.out.println("UserService->storeFile--> 文件类型不受支持！程序停止");
            return null;
        }
        try {
            System.out.println("UserService->storeFile--> " + folder + newName + " 正在存储拥有新名字的文件");
            file.transferTo(new File(folder, newName));
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("UserService->storeFile--> " + folder + newName + " 此位置存储失败！程序停止");
            return null;
        }
        System.out.println("UserService->storeFile--> " + folder + newName + " 成功存储新文件，返回主调函数");
        return newName;
    }

    public String getURL(String fileName, HttpServletRequest request) {
        System.out.println("UserService->getURL-->  开始运行...");
        String url = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + "/avatar/" + fileName;
        System.out.println("UserService->getURL--> " + url + " 成功获得URL");
        return url;
    }

    public int findid(User user) {
        System.out.println("UserService->findid--> " + user + " 正在寻找此用户id");
        QueryWrapper<User> wrapper = new QueryWrapper();
        wrapper.eq("username", user.getUsername());
        User um = userMapper.selectOne(wrapper);
        return um.getId();
    }

    public int updateById(User user) {
        System.out.println("UserService->updateById--> " + user + " 新数据即将被更新");
        user.setId(findid(user));
        return userMapper.updateById(user);
    }

    public User selectById(int id) {
        System.out.println("UserService->selectById--> " + id + " 正在查询...");
        return userMapper.selectById(id);
    }

}
