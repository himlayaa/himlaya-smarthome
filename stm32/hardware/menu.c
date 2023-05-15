#include "stm32f10x.h"                  // Device header

#include "key.h"
#include "base.h"
#include "menu.h"
#include "icon.h"
#include "SIM800L.h"

extern u8 temper;  	   //
extern u8 humi;		   //
extern u16 smoke;     	   //
extern float light;	   //
extern u8 alarmFlag,beepFlag;
extern u8 Wind_flag;
extern u8 Motor_flag;
extern u8 Air_value;
extern u8 WIFI_Connect;
extern u8g2_t u8g2; 
uint8_t pos = 25;
uint8_t tar = 50;

float STEP_MAX= 10.00;//步进最大允许值
//STEP变量
float Step_dev[4]={0,0,0,0};//空调温度、风扇速度、LED1亮度、LED2亮度
float send_rate = 0.00;

uint8_t disappear_step=1;

double Light_angle,Light_angle_last;
float angle,angle_last;
//实时坐标
uint8_t chart_x;
bool frame_is_drawed = false,has_been_sent = false;
uint8_t curve_select = 0;
uint8_t chartL_x;
int16_t chartL_y,chartL_y_trg;//目标和当前
uint8_t chartL_line_y,chartL_line_y_trg;//线的位置
uint8_t chartL_box_width,chartL_box_width_trg;//框的宽度
int16_t chartL_box_y,chartL_box_y_trg;//框的当前值和目标值


//指向buf首地址的指针
uint8_t* buf_ptr;
uint16_t buf_len;

//选择界面变量
uint8_t x;
int16_t y,y_trg;//目标和当前
uint8_t line_y,line_y_trg;//线的位置
uint8_t box_width,box_width_trg;//框的宽度
int16_t box_y,box_y_trg;//框的当前值和目标值
int8_t ui_select;//当前选中那一栏


//硬件界面变量
uint8_t hardware_x;
int16_t hardware_y,hardware_y_trg;//目标和当前
uint8_t hardware_line_y,hardware_line_y_trg;//线的位置
uint8_t hardware_box_width,hardware_box_width_trg;//框的宽度
int16_t hardware_box_y,hardware_box_y_trg;//框的当前值和目标值
int8_t hardware_select;//当前选中那一栏

//step界面变量
int16_t step_y,step_y_trg;
uint8_t step_line_y,step_line_y_trg;//线的位置
uint8_t step_box_width,step_box_width_trg;//框的宽度
int16_t step_box_y,step_box_y_trg;//框的当前值和目标值
int8_t step_select;//当前选中那一栏

//device界面变量
int16_t device_y,device_y_trg;//目标和当前
uint8_t device_line_y,device_line_y_trg;//线的位置
uint8_t device_box_width,device_box_width_trg;//框的宽度
int16_t device_box_y,device_box_y_trg;//框的当前值和目标值
int8_t device_select;//当前选中那一栏

//icon界面变量
int16_t icon_x,icon_x_trg;
int16_t app_y,app_y_trg;
int8_t icon_select;


extern uint8_t ui_index,ui_state;
uint8_t send_confirm;
SELECT_LIST icon[]=
{
  {"Main"},
  {"Curve"},
  {"Hardware"},
  {"Setting"},
  {"Message"},
};

Device curve[]=
{
  {"temp",0},
  {"humidity",0},
  {"light",0},
  {"smoke",0},
};

SELECT_LIST hardware[]=
{
  {"DHT11"},
  {"BH1750"},
  {"MQ-2"},
  {"Infrared"},
  {"SIM800L"},
  {"DC motor"},
  {"Relay"},
  {"Beep"},
  {"OLED"},
  {"ESP8266-01s"},
};



SELECT_LIST step[]=
{
  {"-Aircondition"},
  {"-Wind"},
  {"-LED1"},
  {"-LED2"},
  {"Return"},
};
uint8_t step_num = sizeof(step)/sizeof(SELECT_LIST);//step选项数量

SELECT_LIST list[]=
{
  {"-Return"},
  {"+Step Editor"},
  {"-Chart Test"},
  {"-Text Edit"},
  {"-Device SW"},
  {"{ About }"},
};

Device device[]=
{
  {"-Aircondition",0},
  {"-Beep",0},
  {"-Led1",0},
  {"-Led2",0},
  {"-Elec1",0},
  {"-Elec2",0},
  {"-Return"},
};
uint8_t device_num = sizeof(device)/2/sizeof(SELECT_LIST);//sizeof(device)/sizeof(SELECT_LIST);//device选项数量


extern u8 Wind_speed[5];	   //
extern u8 Wind_value;
extern u8 LED1_pwm;	      //LED1
extern u8 LED2_pwm;	      //LED2
extern u8 Elec1_value;    //
extern u8 Elec2_value;    //

//const uint8_t row_Num = 63;
const uint8_t list_num = sizeof(list)/sizeof(SELECT_LIST);//list选择界面数量
const uint8_t single_line_length = 63 /list_num;
uint8_t total_line_length= single_line_length*list_num+1;


const uint8_t hardware_num = sizeof(hardware)/sizeof(SELECT_LIST);//hardware选择界面数量
const uint8_t hardware_single_line_length = 63 /hardware_num;
uint8_t hardware_total_line_length = hardware_single_line_length*hardware_num+1;


//设备名称
unsigned char  send_str[] = "Himlaya Smarthome";
//允许名字的最大长度
const uint8_t send_str_len= 18;//0-11for send_str  17 for return 18 send
uint8_t edit_index=0,chart_index=0;
bool edit_flag=false;//默认不在编辑
uint8_t blink_flag;//默认高亮
const uint8_t BLINK_SPEED=16;//2的倍数

uint8_t icon_num = sizeof(icon)/sizeof(SELECT_LIST);

const uint8_t curve_num = sizeof(curve)/2/sizeof(SELECT_LIST);
const uint8_t chart_single_line_length = 63 /curve_num;
uint8_t chart_total_line_length= chart_single_line_length*curve_num+1;


KEY key[3]={false};
KEY_MSG key_msg={0};

/**************************界面显示*******************************/

void logo_ui_show(void)//显示logo
{
  u8g2_DrawXBMP(&u8g2,0,0,128,64,LOGO);

}

bool get_key_val(uint8_t ch)
{
  switch (ch)
  {
    case 0:
    return PAin(5);//digitalRead(BTN0);
    break;
    case 1:
    return PAin(7);//digitalRead(BTN1);
    break;
    case 2:
    return PAin(6);//digitalRead(BTN2);
    break;
    default:
    break;
  }
  return false;
}

void key_init(void)
{
  KEY_GPIO_Init();
  for(uint8_t i=0;i<(sizeof(key)/sizeof(KEY));++i)
  {
    key[i].val=key[i].last_val=get_key_val(i);
  }
}

void key_scan(void)
{
  for(uint8_t i=0;i<(sizeof(key)/sizeof(KEY));++i)
  {
    key[i].val=get_key_val(i);//获取键值
    if(key[i].last_val!=key[i].val)//发生改变
    {
      key[i].last_val=key[i].val;//更新状态
      if(key[i].val==0)
      {
      key_msg.id=i;
      key_msg.pressed=true;
      }
    }
  }
}


//移动函数
bool move(int16_t* a,int16_t* a_trg)
{
  if (*a < *a_trg)
  {
    *a+=SPEED;
    if (*a>*a_trg) *a=*a_trg;//加完超过
  }
  else if(*a>*a_trg)
  {
    *a-=SPEED;
    if (*a<*a_trg) *a=*a_trg;//减完不足
  }
  else
  {
    return true;//到达目标
  }
  return false;//未到达
}

//移动函数
bool move_icon(int16_t* a,int16_t* a_trg)
{
  if (*a < *a_trg)
  {
    *a+=ICON_SPEED;
    if (*a>*a_trg) *a=*a_trg;//加完超过
  }
  else if(*a>*a_trg)
  {
    *a-=ICON_SPEED;
    if (*a<*a_trg) *a=*a_trg;//减完不足
  }
  else
  {
    return true;//到达目标
  }
  return false;//未到达
}

//宽度移动函数
bool move_width(uint8_t* a,uint8_t* a_trg,uint8_t select,uint8_t id)
{
  if (*a < *a_trg)
  {
    uint8_t stepp=16/SPEED;//判断步数
    uint8_t len;
    if(ui_index==M_SELECT)
    {
		
		//u8g2.pixel_buf_width(list[select].select)-u8g2.width(list[id==0?select+1:select-1].select)
    len=abs(_str_w_(list[select].select)-_str_w_(list[id==0?select+1:select-1].select));
    }
    else if(ui_index==M_STEP)
    {
    len=abs(_str_w_(step[select].select)-_str_w_(step[id==0?select+1:select-1].select));
    }
    uint8_t width_speed=((len%stepp)==0?(len/stepp):(len/stepp+1));   //计算步长
    *a+=width_speed;
    if (*a>*a_trg) *a=*a_trg;//
  }
  else if(*a>*a_trg)
  {
    uint8_t stepp=16/SPEED;//判断步数
    uint8_t len;
    if(ui_index==M_SELECT)
    {
    len=abs(_str_w_(list[select].select)-_str_w_(list[id==0?select+1:select-1].select));
    }
    else if(ui_index==M_STEP)
    {
    len=abs(_str_w_(step[select].select)-_str_w_(step[id==0?select+1:select-1].select));
    }
    uint8_t width_speed=((len%stepp)==0?(len/stepp):(len/stepp+1));   //计算步长
    *a-=width_speed;
    if (*a<*a_trg) *a=*a_trg;
  }
  else
  {
    return true;//到达目标
  }
  return false;//未到达
}

//进度条移动函数
bool move_bar(uint8_t* a,uint8_t* a_trg)
{
  if (*a < *a_trg)
  {
    uint8_t step=16/SPEED;//判断步数
    uint8_t width_speed=((single_line_length%step)==0?(single_line_length/step):(single_line_length/step+1));   //计算步长
    *a+=width_speed;
    if (*a>*a_trg) *a=*a_trg;//
  }
  else if(*a>*a_trg)
  {
    uint8_t step=16/SPEED;//判断步数
    uint8_t width_speed=((single_line_length%step)==0?(single_line_length/step):(single_line_length/step+1));   //计算步长
    *a-=width_speed;
    if (*a<*a_trg) *a=*a_trg;
  }
  else
  {
    return true;//到达目标
  }
  return false;//未到达
}



//文字编辑函数
void text_edit(bool dir,uint8_t index)
{
  if(!dir)
  {
    if(send_str[index]>='A' && send_str[index]<='Z')//大写字母
    {
      if(send_str[index]=='A')
      {
        send_str[index]='z';
      }
      else
      {
        send_str[index]-=1;
      }
    }
    else if(send_str[index]>='a' && send_str[index]<='z')//小写字母
    {
      if(send_str[index]=='a')
      {
        send_str[index]=' ';
      }
      else
      {
        send_str[index]-=1;
      }
    }
    else
    {
      send_str[index]='Z';
    }
  }
  else
  {
    if(send_str[index]>='A' && send_str[index]<='Z')//大写字母
    {
      if(send_str[index]=='Z')
      {
        send_str[index]=' ';
      }
      else
      {
        send_str[index]+=1;
      }
    }
    else if(send_str[index]>='a' && send_str[index]<='z')//小写字母
    {
      if(send_str[index]=='z')
      {
        send_str[index]='A';
      }
      else
      {
        send_str[index]+=1;
      }
    }
    else
    {
      send_str[index]='a';
    }
  }
}

//消失函数
void disappear(void)
{
  switch(disappear_step)
  {
    case 1:
    for(uint16_t i=0;i<buf_len;++i)
    {
      if(i%2==0) buf_ptr[i]=buf_ptr[i] & 0x55;
    }
    break;
    case 2:
    for(uint16_t i=0;i<buf_len;++i)
    {
      if(i%2!=0) buf_ptr[i]=buf_ptr[i] & 0xAA;
    }
    break;
    case 3:
    for(uint16_t i=0;i<buf_len;++i)
    {
      if(i%2==0) buf_ptr[i]=buf_ptr[i] & 0x00;
    }
    break;
    case 4:
    for(uint16_t i=0;i<buf_len;++i)
    {
      if(i%2!=0) buf_ptr[i]=buf_ptr[i] & 0x00;
    }
    break;
    default:
    ui_state=S_NONE;
    disappear_step=0;
    break;
  }
  disappear_step++;
}

void select_ui_show(void)//选择界面
{
  move_bar(&line_y,&line_y_trg);
  move(&y,&y_trg);
  move(&box_y,&box_y_trg);
  move_width(&box_width,&box_width_trg,ui_select,key_msg.id);
  
	_draw_vline(126,0,total_line_length);
	_draw_pixel(125,0);
	_draw_pixel(127,0);
  for(uint8_t i=0;i<list_num;++i)
  { 
	  _draw_str(x,16*i+y+12,list[i].select);// 第一段输出位置 
	  _draw_pixel(125,single_line_length*(i+1));
	  _draw_pixel(127,single_line_length*(i+1));
  }
  
  _draw_vline(125,line_y,single_line_length-1);
  _draw_vline(127,line_y,single_line_length-1);
  _set_color(2);
  _draw_Rbox(0,box_y,box_width,16,1);;
  _set_color(1);
}


void hardware_ui_show(void)//选择界面
{
  move_bar(&hardware_line_y,&hardware_line_y_trg);
  move(&hardware_y,&hardware_y_trg);
  move(&hardware_box_y,&hardware_box_y_trg);
  move_width(&hardware_box_width,&hardware_box_width_trg,hardware_select,key_msg.id);
  
	_draw_vline(126,0,hardware_total_line_length);
	_draw_pixel(125,0);
	_draw_pixel(127,0);
  for(uint8_t i=0;i< hardware_num;++i)
  { 
	  _draw_str(hardware_x,16*i+hardware_y+12,hardware[i].select);// 第一段输出位置 
	  _draw_pixel(125,hardware_single_line_length*(i+1));
	  _draw_pixel(127,hardware_single_line_length*(i+1));
  }
  
  _draw_vline(125,hardware_line_y,hardware_single_line_length-1);
  _draw_vline(127,hardware_line_y,hardware_single_line_length-1);
  _set_color(2);
  _draw_Rbox(0,hardware_box_y,hardware_box_width,16,1);;
  _set_color(1);
}

void step_ui_show(void)//step界面
{
  move_bar(&step_line_y,&step_line_y_trg);
  move(&step_y,&step_y_trg);
  move(&step_box_y,&step_box_y_trg);
  move_width(&step_box_width,&step_box_width_trg,step_select,key_msg.id);
  
	_draw_vline(126,0,total_line_length);
	_draw_pixel(125,0);
	_draw_pixel(127,0);
  for(uint8_t i=0;i<step_num;i++)
  { 
	  _draw_str(x,16*i+step_y+12,step[i].select);// 第一段输出位置 
	  _draw_pixel(125,single_line_length*(i+1));
	  _draw_pixel(127,single_line_length*(i+1));
  }
  
  _draw_vline(125,step_line_y,single_line_length-1);
  _draw_vline(127,step_line_y,single_line_length-1);
  _set_color(2);
  _draw_Rbox(0,step_box_y,step_box_width,16,1);
  _set_color(1);
}

void step_edit_ui_show(void)//显示step编辑
{
  _draw_box(16,16,96,31);
  _set_color(2);
  _draw_box(17,17,94,29);
  _set_color(1);

  _draw_frame(18,36,60,8);
	
	if(step_select == 0)STEP_MAX = 32.00;
	else if(step_select == 1)STEP_MAX = 4.00;
	else STEP_MAX = 100.00;
	
	
  _draw_box(20,38,(uint8_t)(Step_dev[step_select]/STEP_MAX*56),4);

  switch(step_select)
  {
    case 0:
	_draw_str(22,30,"Aircondition +/-");	
    break;
    case 1:
	_draw_str(22,30,"Wind Speed +/-");
    break;
    case 2:
	_draw_str(22,30,"LED1 value +/-");
    break;
	case 3:
	_draw_str(22,30,"LED2 value +/-");
    break;
	
    default:
    break;
  }
  _draw_num(81,44,"%.2f",Step_dev[step_select]);
  
}


void send_confirm_show(void)//发送确认界面
{
  _draw_Rframe(4,6,120,40,8);
  _draw_str(10,60,"-Cancel");
  _draw_str((128-u8g2_GetStrWidth(&u8g2,"--Send Confirm--"))/2,20,"--Send Confirm--");
  _draw_str(10,38,send_str);
  _draw_str(80,60,"-Send");
  
	
  if(!send_confirm){
    _set_color(2);
    _draw_Rbox(8,50,u8g2_GetStrWidth(&u8g2,"-Cancel ")+4,15,1);
    _set_color(1);
	  
  }else{ //send
	_set_color(2);
    _draw_Rbox(78,50,u8g2_GetStrWidth(&u8g2,"-Send ")+4,15,1);
    _set_color(1);
	  
  }
}


void send_show(void){ //发送页面

	u8g2_DrawXBMP(&u8g2,47,2,32,32,SUCCESS_ICON);
	_draw_str(44,40,"Success!");
	
}


void icon_ui_show(void)//显示icon
{

  move_icon(&icon_x,&icon_x_trg);
  move(&app_y,&app_y_trg);

  for(uint8_t i=0;i< icon_num;++i)
  {
    u8g2_DrawXBMP(&u8g2,46+icon_x+i*ICON_SPACE,6,36,icon_width[i],icon_pic[i]);
    u8g2_SetClipWindow(&u8g2,0, 48,128 , 64 );
    _draw_str((128-_str_w_(icon[i].select))/2,62-app_y+i*16,icon[i].select);
    u8g2_SetMaxClipWindow(&u8g2);
  }

}

void chart_draw_frame(void)//chart界面
{
  _draw_str(4,12,"Return");
  _draw_str(50,12,curve[curve_select].select);
  _draw_Rbox(4,18,120,46,8);
  _set_color(2);
  _draw_hline(10,58,108); //横线
  _draw_vline(10,24,34); //竖线
  //箭头
	
  _draw_pixel(7,27);
  _draw_pixel(8,26);
  _draw_pixel(9,25);
  
  _draw_pixel(116,59);
  _draw_pixel(115,60);  
  _draw_pixel(114,61);  
  _set_color(1);
	
  if(chart_index == 0){ //return
    _set_color(2);
    _draw_Rbox(2,1,u8g2_GetStrWidth(&u8g2,"Return")+4,15,1);
    _set_color(1);
	  
  }else{ //选择曲线
	_set_color(2);
    _draw_Rbox(48,1,u8g2_GetStrWidth(&u8g2,curve[curve_select].select)+4,15,1);
    _set_color(1);
  }
  if(curve_select == 0)
  curve[curve_select].state = temper; //初始化温度曲线

}
void chart_select_ui_show(void)//显示chart下拉菜单
{

  move_bar(&chartL_line_y,&chartL_line_y_trg);
  move(&chartL_y,&chartL_y_trg);
  move(&chartL_box_y,&chartL_box_y_trg);
  move_width(&chartL_box_width,&chartL_box_width_trg,curve_select,key_msg.id);
  
	_draw_vline(126,0,chart_total_line_length);
	_draw_pixel(125,0);
	_draw_pixel(127,0);
  for(uint8_t i=0;i< curve_num;i++)
  { 
	  _draw_str(chartL_x,16*i+chartL_y+12,curve[i].select);// 第一段输出位置 
	  _draw_pixel(125,chart_single_line_length*(i+1));
	  _draw_pixel(127,chart_single_line_length*(i+1));
  }
  
  _draw_vline(125,chartL_line_y,chart_single_line_length-1);
  _draw_vline(127,chartL_line_y,chart_single_line_length-1);
  _set_color(2);
  _draw_Rbox(0,chartL_box_y,chartL_box_width,16,1);
  _set_color(1);
  
}

void chart_ui_show(void)//chart界面
{
  if(!frame_is_drawed)//框架只画一遍
  {
    _clear();
    chart_draw_frame();
    angle_last = 0.00;//+(float)analogRead(READ)/100.00;
    frame_is_drawed=true;
  }

  _draw_box(96,0,30,14);

  _draw_vline(chart_x+10,59,3);
  if(chart_x==100) chart_x=0;

  //u8g2_DrawBox(chart_x+11,24,8,32);

  _draw_vline(chart_x+11,24,34);
  _draw_vline(chart_x+12,24,34);
  _draw_vline(chart_x+13,24,34);
  _draw_vline(chart_x+14,24,34);
  
  //异或绘制
  _set_color(2);
	  angle = curve[curve_select].state;//设置值
  if(curve_select == 2)
	_draw_line(chart_x+11,58-(int)angle_last/1000,chart_x+12,58-(int)angle/1000);//值线
  else 
	 _draw_line(chart_x+11,58-(int)angle_last/2,chart_x+12,58-(int)angle/2);//值线
	  _draw_vline(chart_x+12,59,3);
	  angle_last = angle;
	  chart_x+=2;
	  _draw_box(96,0,30,14);
	  _set_color(1);

	  set_curve_state();
	  _draw_num(curve_select == 2? 80 : 96,12,"%.1f",angle);
  //}
}


void text_edit_ui_show(void)
{
  _draw_Rframe(4,6,120,40,8);
  _draw_str(10,60,"-Return");
  _draw_str((128-u8g2_GetStrWidth(&u8g2,"--Text Editor--"))/2,20,"--Text Editor--");
  _draw_str(10,38,send_str);
  _draw_str(80,60,"-Send");

  uint8_t box_x=9;

  //绘制光标
  if(edit_index < send_str_len - 1)
  {
    if(blink_flag<BLINK_SPEED/2)
    {
      for(uint8_t i=0;i<edit_index;++i)
      {
        char temp[2]={send_str[i],'\0'};
        box_x+=_str_w_(temp);
        if(send_str[i]!=' ')
        {
          box_x++;
        }  
      }
      char temp[2]={send_str[edit_index],'\0'};
      _set_color(2);
      u8g2_DrawBox(&u8g2,box_x,26,_str_w_(temp)+2,16);
      _set_color(1);
    }
  }
  else if(edit_index == 17) //return
  {
    _set_color(2);
    _draw_Rbox(8,50,u8g2_GetStrWidth(&u8g2,"-Return")+4,15,1);
    _set_color(1);
	  
  }else{ //send
	_set_color(2);
    _draw_Rbox(78,50,u8g2_GetStrWidth(&u8g2,"-Return")+4,15,1);
    _set_color(1);
	  
  }

  if(edit_flag)//处于编辑状态
  {
    if(blink_flag<BLINK_SPEED)
    {
    blink_flag+=1;
    }
    else
    {
      blink_flag=0;
    }
  }
  else
  {
    blink_flag=0;
  }

}

void device_show(void){ //device界面

  
  //----------------------------------
  move_bar(&device_line_y,&device_line_y_trg);
  move(&device_y,&device_y_trg);
  move(&device_box_y,&device_box_y_trg);
  move_width(&device_box_width,&device_box_width_trg,device_select,key_msg.id);
  
	_draw_vline(126,0,total_line_length);
	_draw_pixel(125,0);
	_draw_pixel(127,0);
  for(uint8_t i=0;i< device_num;i++)
  { 
	  _draw_str(x,16*i+device_y+12,device[i].select);// 第一段输出位置 
	  if(i == device_select && i < 6)
	  _draw_str(100,16*i+device_y+12,device[i].state > 0 ? "[on]" : "[off]");
	  _draw_pixel(125,15*(i+1));
	  _draw_pixel(127,15*(i+1));
  }
  
  _draw_vline(125,device_line_y,14);
  _draw_vline(127,device_line_y,14);
  _set_color(2);
  _draw_Rbox(0,device_box_y,device_box_width,16,1);;
  _set_color(1);
}


void about_ui_show(void)//about界面
{

  _draw_str(2,12,"MCU : AIR32F103CCT6");
  _draw_str(2,28,"FLASH : 256KB");
  _draw_str(2,44,"RAM : 64KB");
  _draw_str(2,60,"-powered by himlaya");
  
}

void warning_show(void){
	
  u8g2_DrawXBMP(&u8g2,39,0,48,42,WARNING);
  _draw_str(37,55,"WARNING!");
		
}

void logo_proc(void)//logo界面处理函数
{
  if(key_msg.pressed)
  {
    key_msg.pressed=false;
    ui_state=S_DISAPPEAR;
    ui_index=M_ICON;
  }
  logo_ui_show();
}

void step_edit_proc(void)//step编辑界面处理函数
{
  if(key_msg.pressed)
  {
    key_msg.pressed=false;
    switch(key_msg.id)
    {
      case 0:
	  switch(step_select){
		  case 0:
			  if(Step_dev[step_select] == 16) {Step_dev[step_select] = 0; break;}
			  if(Step_dev[step_select] > 16) Step_dev[step_select] -= 1;
			  Air_value = Step_dev[step_select];
		  break;
		  case 1:
			  if(Step_dev[step_select] > 0) Step_dev[step_select] -= 1;
			  Wind_value = Wind_speed[(int)Step_dev[step_select]];
			  if(Step_dev[step_select] == 0) Motor_flag = 0;
			  
		  break;
		  case 2:
			  if(Step_dev[step_select] > 0) Step_dev[step_select] -= 10;
			  LED2_pwm = Step_dev[step_select];
		  break;
		  case 3:
			  if(Step_dev[step_select] > 0) Step_dev[step_select] -= 10;
			  LED1_pwm = Step_dev[step_select];
		  break;
		  default:
		  break;
	  }
      break;
      case 1:
		  switch(step_select){
		  case 0:
			  if(Step_dev[step_select] == 0) {Step_dev[step_select] = 26; break;}
			  if(Step_dev[step_select] < 32) Step_dev[step_select] += 1;
			  Air_value = Step_dev[step_select];
		  break;
		  case 1:
			  if(Step_dev[step_select] < 4) Step_dev[step_select] += 1;
			  Wind_value = Wind_speed[(int)Step_dev[step_select]];
			  Motor_flag = 1;
		  break;
		  case 2:
			  if(Step_dev[step_select] < 100) Step_dev[step_select] += 10;
			   LED2_pwm = Step_dev[step_select];
		  break;
		  case 3:
			  if(Step_dev[step_select] < 100) Step_dev[step_select] += 10;
			   LED1_pwm = Step_dev[step_select];
		  break;
		  default:
		  break;  
	  }
      break;
      case 2:
      ui_index = M_STEP;
      break;
      default:
      break;
    }
  }
  step_ui_show();
  for(uint16_t i=0;i<buf_len;++i)
  {
    buf_ptr[i]=buf_ptr[i] & (i%2==0?0x55:0xAA);
  }
  step_edit_ui_show();
}

void step_proc(void)//step界面处理函数
{
 
if(key_msg.pressed)
  {  
    key_msg.pressed=false;
    switch(key_msg.id)
    {
      case 0: //减
	  if(step_select<1) break;
	  step_select-=1;
	  step_line_y_trg-=single_line_length;
	  if(step_select <-(step_y/16))
	  {
		step_y_trg+=16;
	  }
	  else
	  {
		step_box_y_trg-=16;   
      }
      break;	  
      case 1: //加
	  if((step_select+2)>(sizeof(step)/sizeof(SELECT_LIST))) break;
      step_select += 1;
      step_line_y_trg += single_line_length;
      if((step_select+1)>(4-step_y/16))
      {
        step_y_trg-=16;
      }
      else
      {
        step_box_y_trg+=16; 
      }

      break;
	   
      case 2: //确认
      if(step_select==4)
      {  
        ui_index = M_SELECT; //返回Select界面
        ui_state = S_DISAPPEAR;
        step_select = 0;
		
		step_y = step_y_trg = 0;
        step_line_y = step_line_y_trg=1;
        step_box_y = step_box_y_trg = 0;
		  
        step_box_width = step_box_width_trg = _str_w_(step[step_select].select)+x*2;
      }
      else
      {
        ui_index=M_STEP_EDIT;
      }
      break;
      default:
      break;
    }
    step_box_width_trg=_str_w_(step[step_select].select)+x*2;
  }
  step_ui_show();
}

void hardware_proc(void)//选择界面处理
{
	
  if(key_msg.pressed)
  {
    key_msg.pressed = false;
    switch(key_msg.id)
    {
      case 0:
      if(hardware_select<1) break;
      hardware_select-=1;
      hardware_line_y_trg -= hardware_single_line_length;
      if(hardware_select < -(hardware_y/16))
      {
        hardware_y_trg+=16;
      }
      else
      {
        hardware_box_y_trg -= 16;   
      }
 
      break;
      case 1:
      if((hardware_select+2)> hardware_num) break;
      hardware_select+=1;
      hardware_line_y_trg += hardware_single_line_length;
      if((hardware_select+1)>(4-hardware_y/16))
      {
        hardware_y_trg-=16;
      }
      else
      {
        hardware_box_y_trg+=16; 
      }

      break;
      case 2:
      switch(hardware_select) //硬件列表，确认返回
      {
        case 0:     //
        case 1:     //
        case 2:   //
        case 3:   //
		case 4:   //
        case 5:   //
		case 6:   //
		case 7:   //
		case 8:   //
		case 9:   //
        ui_state=S_DISAPPEAR;
        ui_index=M_ICON;
        break;
        default:
        break;
      }
      //Serial.println("Btn2");
      default:
      break;
    }
    //Serial.println(ui_select);
    hardware_box_width_trg = _str_w_(hardware[hardware_select].select)+hardware_x*2;
  }
  hardware_ui_show();
}


void select_proc(void)//选择界面处理
{
  if(key_msg.pressed)
  {
    key_msg.pressed=false;
    switch(key_msg.id)
    {
      case 0:
      if(ui_select<1) break;
      ui_select-=1;
      line_y_trg-=single_line_length;
      if(ui_select<-(y/16))
      {
        y_trg+=16;
      }
      else
      {
        box_y_trg-=16;   
      }
 
      break;
      case 1:
      if((ui_select+2)>list_num) break;
      ui_select+=1;
      line_y_trg+=single_line_length;
      if((ui_select+1)>(4-y/16))
      {
        y_trg-=16;
      }
      else
      {
        box_y_trg+=16; 
      }

      break;
      case 2:
      switch(ui_select)
      {
        case 0:     //return
        ui_state=S_DISAPPEAR;
        ui_index=M_ICON;
        break;
        case 1:     //step
        ui_state=S_DISAPPEAR;
        ui_index=M_STEP;
        break;
        case 2:   //chart
		ui_state=S_DISAPPEAR;
        ui_index=M_CHART;
		break;
        case 3:   //textedit
        ui_state=S_DISAPPEAR;
        ui_index=M_TEXT_EDIT; //这里没有处理video页面，所以没有5
        break;
		case 4:   //device
        ui_state=S_DISAPPEAR;
        ui_index=M_DEVICE; //这里没有处理video页面，所以没有5
        break;
        case 5:   //about
        ui_state=S_DISAPPEAR;
        ui_index=M_ABOUT;
        break;
        default:
        break;
      }
      //Serial.println("Btn2");
      default:
      break;
    }
    //Serial.println(ui_select);
    box_width_trg=_str_w_(list[ui_select].select)+x*2;
  }
  select_ui_show();
}

void icon_proc(void)//icon界面处理
{
  icon_ui_show();
    if(key_msg.pressed)
  {
    key_msg.pressed=false;
    switch(key_msg.id)
    { 
      case 1: //下一个
      if(icon_select != (icon_num-1)){
	  icon_select+=1;
	  
       app_y_trg+=16;
       icon_x_trg-=ICON_SPACE;
	  }
      break;
	  
      case 0: //上一个
      if(icon_select != 0){
	  icon_select -= 1;
	  app_y_trg-=16;
      icon_x_trg+=ICON_SPACE;
	  }
      break;
	  
      case 2: //确定
	  switch(icon_select)
      {
        case 0:     //主页面
        ui_state=S_DISAPPEAR;
        ui_index=M_LOGO;
		icon_select=0;
		icon_x=icon_x_trg=0;
		app_y=app_y_trg=0;
        break;
        case 1:     //曲线
        ui_state=S_DISAPPEAR;
        ui_index=M_CHART;
        break;
        case 2:   //传感器
        ui_state=S_DISAPPEAR;
        ui_index=M_HARDWARE;
        break;
		case 3:   //设置
        ui_state=S_DISAPPEAR;
        ui_index=M_SELECT;
        break;
        case 4:   //消息
        ui_state=S_DISAPPEAR;
        ui_index=M_TEXT_EDIT; //这里没有处理video页面，所以没有5
        break;
        default:
        break;
      }
      
      break;
      default:
      break;
    }
  }
}

void chart_proc(void)//chart界面处理函数
{

  chart_ui_show();
  if(key_msg.pressed)
  {
    key_msg.pressed=false;
    switch(key_msg.id)
    {
      case 0:
	  if(chart_index <= 0) break;
	  chart_index -= 1;
	  _clear();
	  chart_draw_frame();
      break;
      case 1:
	  if(chart_index >= 1)break;
	  chart_index += 1;
	   _clear();
	  chart_draw_frame();
	  break;
      case 2:
		if(chart_index == 0){
		 ui_state=S_DISAPPEAR;
		 ui_index=M_ICON;
		 frame_is_drawed = false;//退出后框架为未画状态
		 chart_x=0;
		 break;
		}else if(chart_index ==1){ //曲线选择
		 ui_state=S_DISAPPEAR;
		 ui_index=M_CHART_SELECT;
		break;
		}
		break;
	default:
	break;	  
	  }  
	}
 
  }

void chart_select_proc(void){
	
	chart_select_ui_show();
	
	if(key_msg.pressed)
	{
    key_msg.pressed=false;
	
    switch(key_msg.id)
    {
      case 0:
		  if(curve_select <1) break;
		  curve_select-=1;
		  chartL_line_y_trg -= chart_single_line_length;
		  if(curve_select<-(chartL_y/16))
		  {
			chartL_y_trg+=16;
		  }
		  else
		  {
			chartL_box_y_trg-=16;   
		  }
 
      break;
      case 1:
		  if((curve_select+2)> curve_num) break;
		  curve_select+=1;
		  chartL_line_y_trg += chart_single_line_length;
		  if((curve_select+1)>(4-chartL_y/16))
		  {
			chartL_y_trg-=16;
		  }
		  else
		  {
			chartL_box_y_trg+=16; 
		  }

		  break;
      case 2:
		  switch(curve_select)
		  {
			case 0:     //温度曲线
			curve_select = 0;
			curve[curve_select].state = temper;
			ui_state=S_DISAPPEAR;
			ui_index=M_CHART;
			frame_is_drawed = false;
			break;
			case 1:   //湿度曲线
			curve_select = 1;
			curve[curve_select].state = humi;
			ui_state=S_DISAPPEAR;
			ui_index=M_CHART;
			frame_is_drawed = false;
			break;
			case 2:   //光照度曲线
			curve_select = 2;
			curve[curve_select].state = light;
			ui_state=S_DISAPPEAR;
			ui_index=M_CHART;
			frame_is_drawed = false;
			break;
			case 3:   //烟雾度曲线
			curve_select = 3;
			curve[curve_select].state = smoke;
			ui_state=S_DISAPPEAR;
			ui_index=M_CHART;
			frame_is_drawed = false;
			break;
			default:
			break;
		  }
      default:
      break;
	}
	//Serial.println(ui_select);
    chartL_box_width_trg = _str_w_(curve[curve_select].select) + chartL_x*2;
    }
}
  
	


void text_edit_proc(void)
{
  text_edit_ui_show();
	
  if(key_msg.pressed)
  {
    key_msg.pressed=false;
    switch(key_msg.id)
    {
      case 0:
      if(edit_flag)
      {
        //编辑
        text_edit(false,edit_index);
      }
      else
      {
        if(edit_index == 0)
        {
          edit_index=send_str_len-1;
        }
        else
        {
          edit_index-=1;
        }
      }
      break;
      case 1:
      if(edit_flag)
      {
        //编辑
        text_edit(true,edit_index);
      }
      else
      {
        if(edit_index == send_str_len)
        {
          edit_index=0;
        }
        else
        {
          edit_index+=1;
        }  
      }
      break;
      case 2:
      if (edit_index== send_str_len - 1) //return
      {
        ui_state=S_DISAPPEAR;
        ui_index=M_ICON;
        edit_index=0;
		  
      }else if(edit_index== send_str_len){ //send
		ui_state=S_DISAPPEAR;
        ui_index= M_SEND_CONFIRM; //进入发送确认页
		
        edit_index=0;
		  has_been_sent = false;
		  
	  }else
      {
        edit_flag=!edit_flag;
      }
      break;
      default:
      break;
    }
  }
}

void send_confirm_proc(void){
	
	if(key_msg.pressed){
		key_msg.pressed=false;
    switch(key_msg.id)
    {
      case 0:
	   if(send_confirm < 1) break;
	   send_confirm -= 1;
       break;
      case 1:
		  if(send_confirm > 1) break;
		  send_confirm += 1;
		  break;
      case 2:
		  switch(send_confirm)
		  {
			case 0:     //return
			ui_state=S_DISAPPEAR;
			ui_index=M_TEXT_EDIT; //返回编辑界面
			break;
			case 1:   //send
			ui_state=S_DISAPPEAR;
			ui_index=M_SEND;
			break;
			default:
			break;
		  }
      default:
      break;
	}
  }	
	send_confirm_show();
}

void send_proc(void){
	
	send_show();
	if(!has_been_sent)//发一遍
  {
	SIM800L_Init();
	SIM800L_SendData(send_str,send_str_len,"OK");
	has_been_sent = true;
	
	}
  
	if(key_msg.pressed)
	{
	  key_msg.pressed=false;
	switch(key_msg.id)
    {
      case 0: //按键减
      case 1: //按键加
	  case 2: //按键确定
	  ui_state=S_DISAPPEAR;
	  ui_index=M_SELECT;
	  break;
	  default:
		 break;
		 
	}
  }
		
}


void device_proc(void){ //设备处理函数
	
	if(key_msg.pressed)
	{
	  key_msg.pressed=false;
	switch(key_msg.id)
    {
      case 0: //按键减
      if(device_select < 1) break;
      device_select -= 1;
      device_line_y_trg -= single_line_length;
      if(device_select <-(device_y/16))
      {
        device_y_trg += 16;
      }
      else
      {
        device_box_y_trg -= 16;   
      }
 
      break;
      case 1: //按键加
      if((device_select+2)>(sizeof(device)/2/sizeof(SELECT_LIST))) break;
      device_select += 1;
      device_line_y_trg += single_line_length;
      if((device_select+1)>(4-device_y/16))
      {
        device_y_trg-=16;
      }
      else
      {
        device_box_y_trg+=16; 
      }

      break;
	 case 2: //按键确定
      switch(device_select)
      {
		case 0:     //Aircondition
		device[device_select].state = !device[device_select].state;
		if(device[device_select].state) Air_value = 26;
		else Air_value = 0;
        break;
        case 1:     //Beep
		device[device_select].state = !device[device_select].state;
		beepFlag = !beepFlag;
        break;
        case 2:     //Led1
		device[device_select].state = !device[device_select].state;
		if(device[device_select].state) LED2_pwm = 100; //由于PCB焊接位置原因，这里换一下
		else LED2_pwm = 0;
        break;
        case 3:   //Led2
		device[device_select].state = !device[device_select].state;
		if(device[device_select].state) LED1_pwm = 100;
		else LED1_pwm = 0;
        break;
		case 4:   //ELEC1
		device[device_select].state = !device[device_select].state;
		Elec1_value = !Elec1_value;
        break;
        case 5:   //ELEC2
		device[device_select].state = !device[device_select].state;
		Elec2_value = !Elec2_value;
        break;
		case 6:   //return
        if(device_select == 6) //return 
		  {
			ui_index = M_SELECT;
			ui_state = S_DISAPPEAR;
			device_select = 0;
			  
			device_y = device_y_trg = 0;
			device_line_y = device_line_y_trg = 1;
			device_box_y = device_box_y_trg = 0;
			  
			device_box_width = device_box_width_trg = _str_w_(device[device_select].select)+x*2;
		  }
		  else
		  {
			ui_index=M_DEVICE;
		  }
		  break;

        default:
        break;
      }
	  
      default:
      break;
    }
    device_box_width_trg=_str_w_(device[device_select].select)+x*2; 
	}
	device_show();
}

void set_device_state(void){
	device[0].state = (Air_value > 0 ? 1: 0);
	device[1].state = beepFlag; //BEEP标志
	device[2].state = (LED2_pwm > 0 ? 1 : 0);   //LED
	device[3].state = (LED1_pwm > 0 ? 1 : 0);
	device[4].state = Elec1_value; //继电器开关
	device[5].state = Elec2_value;
	
	
	//Step_dev[0] = Air_value; //步进设置赋值
	Step_dev[1] = (Wind_value / 5);
	Step_dev[2] = LED2_pwm;
	Step_dev[3] = LED1_pwm;
	
}


void set_curve_state(void){
	
	curve[0].state = temper;
	curve[1].state = humi;
	curve[2].state = light;
	curve[3].state = smoke;
}
void about_proc(void)//about界面处理函数
{
  if(key_msg.pressed)
  {
    key_msg.pressed=false;
    ui_state=S_DISAPPEAR;
    ui_index=M_SELECT;
  }
  about_ui_show();
}

void warning_proc(void){
  if(key_msg.pressed) //关闭警报
  {
    key_msg.pressed=false;
    ui_state=S_DISAPPEAR;
    ui_index = M_LOGO;
  }
  warning_show();
	
}
/********************************总的UI显示************************************/

void ui_proc(void)//总的UI进程
{
  switch(ui_state)
  {
    case S_NONE:
    if(ui_index!=M_CHART) _clear();
    switch(ui_index)
    {
      case M_LOGO:
      logo_proc();
      break;
	  case M_ICON:
      icon_proc();
      break;
	  case M_CHART:
      chart_proc();
      break;
	  case M_CHART_SELECT:
	  chart_select_proc();
	  break;
	  case M_HARDWARE:
      hardware_proc();
      break;
      case M_SELECT:
      select_proc();
      break;
      case M_STEP:
      step_proc();
      break;
      case M_TEXT_EDIT:
      text_edit_proc();
      break;
	  case M_SEND_CONFIRM:
      send_confirm_proc();
      break;
	  case M_SEND:
      send_proc();
      break;
      case M_STEP_EDIT:
      step_edit_proc();
	  break;
	  case M_DEVICE:
      device_proc();
      break;
      case M_ABOUT:
      about_proc();
      break;
	  case M_WARNING:
	  warning_proc();
      default:
      break;
    }
    break;
    case S_DISAPPEAR:
    disappear();
    break;
    default:
    break;
  }
  _update();
} 

void setup(void) {
  key_init();
  u8g2_SetFont(&u8g2,u8g2_font_wqy12_t_chinese1);

  buf_ptr=u8g2_GetBufferPtr(&u8g2);//拿到buffer首地址
	
  buf_len=8*u8g2_GetBufferTileHeight(&u8g2)*u8g2_GetBufferTileWidth(&u8g2);

  x=4;
  y=y_trg=0;
  line_y=line_y_trg=1;
	
  hardware_x = 4;
  hardware_y = hardware_y_trg = 0;
  hardware_line_y = hardware_line_y_trg=1;
	
  chartL_x=4;
  chartL_y = chartL_y_trg=0;
	
  step_y = step_y_trg = 0;
  step_line_y=step_line_y_trg=1;
	
  device_y = device_y_trg = 0;
  device_line_y = device_line_y_trg=1;
  
  
  ui_select = step_select = icon_select = device_select = curve_select = hardware_select =0;
  icon_x = icon_x_trg=0;
  app_y=app_y_trg=0;

  chartL_box_width = chartL_box_width_trg = _str_w_(curve[curve_select].select)+chartL_x*2;
  box_width = box_width_trg = _str_w_(list[ui_select].select)+x*2;//两边各多2
  hardware_box_width = hardware_box_width_trg = _str_w_(hardware[hardware_select].select)+hardware_x*2;//两边各多2
  step_box_width = step_box_width_trg = _str_w_(step[step_select].select)+x*2;//两边各多2
  device_box_width = device_box_width_trg = _str_w_(device[device_select].select)+x*2;//两边各多2

  ui_index=M_LOGO;
  //ui_index=M_TEXT_EDIT;
  ui_state=S_NONE;
  set_device_state();
  set_curve_state();
}

void loop(void) {
	key_scan();
	
    ui_proc();
	set_device_state();
	
}

