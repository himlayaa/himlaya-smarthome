package com.example.mpdemo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.mpdemo.entity.User;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface smtuserMapper extends BaseMapper<User> {
//    //查询用户,根据id查询
//    @Select("select * from smtuser where id = #{id}")
//    User selectById(Integer id);
//
//
//    //查询用户，根据username查
//    @Select("select * from smtuser where username = #{username}")
//    User selectByName(String username);
//
//    //增加用户
//    @Insert("insert into smtuser values (#{id},#{username},#{pwd},#{email})")
//    public int insert(User user);
}
