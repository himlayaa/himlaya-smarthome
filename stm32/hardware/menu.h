#ifndef __MENU_H
#define __MENU_H

#include <stdbool.h>


#define READ 2


enum//ui_index
{
  M_LOGO,//开始界面
  M_SELECT,//选择界面
  M_STEP,//PID界面
  M_STEP_EDIT,//pid编辑
  M_ICON,//icon界面
  M_CHART,//图表
  M_CHART_SELECT,
  M_HARDWARE,
  M_TEXT_EDIT,//文字编辑
  M_SEND_CONFIRM, //发送确认
  M_SEND,
  M_DEVICE,//设备显示
  M_ABOUT,//关于本机 
  M_WARNING,//警告
};


enum//ui_state
{
  S_NONE,
  S_DISAPPEAR,
  S_SWITCH,
  S_MENU_TO_MENU,
  S_MENU_TO_PIC,
  S_PIC_TO_MENU, 
};



//菜单结构体
typedef struct
{
  char * select;
}SELECT_LIST;


typedef struct 
{
    char *select;
    float state;
}Device;


//按键变量
typedef struct
{
  bool val;
  bool last_val;  
}KEY;



//按键信息
typedef struct
{
uint8_t id;
bool pressed;
}KEY_MSG;



void logo_ui_show(void);
bool get_key_val(uint8_t ch);

void key_init(void);
void key_scan(void);

bool move(int16_t* a,int16_t* a_trg);
bool move_icon(int16_t* a,int16_t* a_trg);
bool move_width(uint8_t* a,uint8_t* a_trg,uint8_t select,uint8_t id);
bool move_bar(uint8_t* a,uint8_t* a_trg);
void text_edit(bool dir,uint8_t index);
void disappear(void);

void select_ui_show(void);
void hardware_ui_show(void);
void step_ui_show(void);
void step_edit_ui_show(void);
void icon_ui_show(void);
void chart_draw_frame(void);
void chart_ui_show(void);
void chart_select_ui_show(void);
void text_edit_ui_show(void);
void send_confirm_show(void);
void send_show(void);
void device_show(void);
void about_ui_show(void);
void warning_show(void);

void logo_proc(void);
void step_edit_proc(void);
void step_proc(void);
void select_proc(void);
void icon_proc(void);
void chart_proc(void);
void chart_select_proc(void);
void hardware_proc(void);
void text_edit_proc(void);
void send_confirm_proc(void);
void send_proc(void);
void device_proc(void);
void set_device_state(void);
void set_curve_state(void);
void about_proc(void);
void warning_proc(void);
void ui_proc(void);

void setup(void);
void loop(void);

#endif