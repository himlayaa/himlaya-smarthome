#ifndef __ICON_H
#define __ICON_H

#define SPEED 4//16的因数
#define ICON_SPEED 12
#define ICON_SPACE 48//图标间隔,speed倍数

const uint8_t icon_pic[][200]=
{
	
  {
	0x00,0x00,0x00,0x01,0x00,0x00,0x00,0x80,
	0x03,0x00,0x00,0x00,0xC0,0x07,0x00,0x00,
	0x00,0xE0,0x0F,0x00,0x00,0x00,0xF0,0x1F,
	0x00,0x00,0x00,0xF8,0x0F,0x00,0x00,0x00,
	0xFC,0x07,0x00,0x00,0x00,0xFE,0x03,0x00,
	0x00,0x00,0xFF,0x01,0x00,0x00,0x80,0xFF,
	0x00,0x00,0x00,0xC0,0x7F,0x00,0x00,0x00,
	0xE0,0x3F,0x00,0x00,0x00,0xF0,0x1F,0x00,
	0x00,0x00,0xF8,0x0F,0x00,0x00,0x00,0xFC,
	0x07,0x00,0x00,0x00,0xFE,0x03,0x00,0x00,
	0x00,0xFF,0x01,0x00,0x00,0x80,0xFF,0x00,
	0x00,0x00,0x80,0xFF,0x00,0x00,0x00,0x00,
	0xFF,0x01,0x00,0x00,0x00,0xFE,0x03,0x00,
	0x00,0x00,0xFE,0x07,0x00,0x00,0x00,0xF8,
	0x0F,0x00,0x00,0x00,0xF0,0x1F,0x00,0x00,
	0x00,0xE0,0x3F,0x00,0x00,0x00,0xC0,0x7F,
	0x00,0x00,0x00,0x80,0xFF,0x00,0x00,0x00,
	0x00,0xFF,0x01,0x00,0x00,0x00,0xFE,0x03,
	0x00,0x00,0x00,0xFC,0x07,0x00,0x00,0x00,
	0xF8,0x0F,0x00,0x00,0x00,0xF0,0x1F,0x00,
	0x00,0x00,0xE0,0x0F,0x00,0x00,0x00,0xC0,
	0x07,0x00,0x00,0x00,0x80,0x03,0x00,0x00,
	0x00,0x00,0x01,0x00,/*"返回\home.bmp",0*/
  },
  {
	0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
	0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
	0x00,0x00,0x00,0x00,0x0C,0x00,0x00,0x00,
	0x00,0x1E,0x00,0x00,0x00,0x00,0x0C,0x00,
	0x00,0x00,0x00,0x0C,0x00,0x00,0x00,0x00,
	0x0C,0x00,0x00,0x00,0x00,0x0C,0x00,0x00,
	0x00,0x00,0x0C,0x00,0x00,0x00,0x00,0x0C,
	0x00,0x00,0x40,0x00,0x0C,0x00,0x00,0xE0,
	0x00,0x0C,0x00,0x00,0xF0,0x00,0x0C,0x00,
	0x00,0x78,0x00,0x0C,0x18,0x00,0x3C,0x00,
	0x0C,0x3C,0x00,0x1E,0x00,0x0C,0x7E,0x00,
	0x0F,0x00,0x0C,0xFF,0x80,0x07,0x00,0x8C,
	0xE7,0xC1,0x03,0x00,0xCC,0xC3,0xE3,0x01,
	0x00,0xFC,0x81,0xF7,0x00,0x00,0xFC,0x00,
	0x7F,0x00,0x00,0x7C,0x00,0x3E,0x00,0x00,
	0x3C,0x00,0x1C,0x00,0x00,0x1C,0x00,0x08,
	0x00,0x00,0x1C,0x00,0x00,0x00,0x00,0x0C,
	0x00,0x00,0x00,0x00,0x0C,0x00,0x00,0x00,
	0x00,0x0C,0x00,0x00,0x00,0x00,0x0C,0x00,
	0x00,0x00,0x02,0xFC,0xFF,0xFF,0xFF,0x07,
	0xFE,0xFF,0xFF,0xFF,0x07,0x00,0x00,0x00,
	0x00,0x02,0x00,0x00,0x00,0x00,0x00,0x00,
	0x00,0x00,0x00,0x00 /*"曲线.bmp",0*/
    /* (36 X 36 )*/
  },
  {
    0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
	0x00,0x00,0x00,0x18,0x86,0x01,0x00,0x00,
	0x18,0x86,0x01,0x00,0xC0,0xFF,0xFF,0x3F,
	0x00,0xE0,0xFF,0xFF,0x7F,0x00,0xF0,0xFF,
	0xFF,0xFF,0x00,0xF0,0xFF,0xFF,0xFF,0x00,
	0xF0,0xFF,0xFF,0xFF,0x00,0xF0,0x01,0x00,
	0xF8,0x00,0xF0,0x01,0x00,0xF8,0x00,0xFC,
	0xF9,0xFF,0xF1,0x03,0xFE,0xF9,0xFF,0xF1,
	0x07,0xFC,0xF9,0xFF,0xF1,0x03,0xF0,0xF9,
	0xFF,0xF1,0x00,0xF0,0xF9,0xFF,0xF1,0x00,
	0xF0,0xF9,0xFF,0xF1,0x00,0xFC,0xF9,0xFF,
	0xF1,0x03,0xFE,0xF9,0xFF,0xF1,0x07,0xF8,
	0xF9,0xFF,0xF1,0x01,0xF0,0xF9,0xFF,0xF1,
	0x00,0xF0,0xF9,0xFF,0xF1,0x00,0xF0,0xF9,
	0xFF,0xF1,0x00,0xFC,0xF9,0xFF,0xF1,0x03,
	0xFE,0xF9,0xFF,0xF1,0x07,0xF8,0x01,0x00,
	0xF0,0x01,0xF0,0x01,0x00,0xF8,0x00,0xF0,
	0x03,0x00,0xFC,0x00,0xF0,0xFF,0xFF,0xFF,
	0x00,0xF0,0xFF,0xFF,0xFF,0x00,0xE0,0xFF,
	0xFF,0x7F,0x00,0xC0,0xFF,0xFF,0x3F,0x00,
	0x00,0xFF,0xFF,0x0F,0x00,0x00,0x18,0x86,
	0x01,0x00,0x00,0x18,0x86,0x01,0x00,0x00,
	0x00,0x00,0x00,0x00,/*"硬件.bmp",0*/

  },
  {
    0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
	0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
	0x80,0x1F,0x00,0x00,0x00,0xC0,0x3F,0x00,
	0x00,0x00,0xC0,0x3F,0x00,0x00,0x00,0xC0,
	0x3F,0x00,0x00,0x00,0xC0,0x3F,0x00,0x00,
	0xC0,0xF3,0xFF,0x3C,0x00,0xC0,0xFF,0xFF,
	0x3F,0x00,0xE0,0xFF,0xFF,0x7F,0x00,0xE0,
	0xFF,0xFF,0xFF,0x00,0xF0,0xFF,0xFF,0xFF,
	0x00,0xF0,0x7F,0xE0,0xFF,0x01,0xF0,0x3F,
	0xC0,0xFF,0x00,0xC0,0x1F,0x80,0x3F,0x00,
	0x80,0x1F,0x80,0x1F,0x00,0x80,0x1F,0x80,
	0x1F,0x00,0x80,0x1F,0x80,0x1F,0x00,0x80,
	0x1F,0x80,0x1F,0x00,0xC0,0x1F,0x80,0x3F,
	0x00,0xF0,0x3F,0xC0,0xFF,0x00,0xF0,0x7F,
	0xE0,0xFF,0x01,0xF0,0xFF,0xFF,0xFF,0x00,
	0xE0,0xFF,0xFF,0xFF,0x00,0xE0,0xFF,0xFF,
	0x7F,0x00,0xC0,0xFF,0xFF,0x3F,0x00,0xC0,
	0xF3,0xFF,0x3C,0x00,0x00,0xC0,0x3F,0x00,
	0x00,0x00,0xC0,0x3F,0x00,0x00,0x00,0xC0,
	0x3F,0x00,0x00,0x00,0xC0,0x3F,0x00,0x00,
	0x00,0x80,0x1F,0x00,0x00,0x00,0x00,0x00,
	0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
	0x00,0x00,0x00,0x00,/*"设置.bmp",0*/
    /* (36 X 36 )*/
  },
  {
    0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
	0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
	0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
	0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
	0x00,0x00,0x00,0x80,0xFF,0xFF,0x1F,0x00,
	0xC0,0xFF,0xFF,0x3F,0x00,0xE0,0xFF,0xFF,
	0x7F,0x00,0xE0,0xFF,0xFF,0x7F,0x00,0xC0,
	0xFF,0xFF,0x3F,0x00,0x00,0xFF,0xFF,0x0F,
	0x00,0x00,0xFE,0xFF,0x03,0x00,0x20,0xF8,
	0xFF,0x60,0x00,0xE0,0xE0,0x7F,0x78,0x00,
	0xE0,0x83,0x1F,0x7C,0x00,0xE0,0x0F,0x07,
	0x7F,0x00,0xE0,0x1F,0xC0,0x7F,0x00,0xE0,
	0x7F,0xE0,0x7F,0x00,0xE0,0xFF,0xF9,0x7F,
	0x00,0xE0,0xFF,0xFF,0x7F,0x00,0xE0,0xFF,
	0xFF,0x7F,0x00,0xE0,0xFF,0xFF,0x7F,0x00,
	0xE0,0xFF,0xFF,0x7F,0x00,0xE0,0xFF,0xFF,
	0x7F,0x00,0xE0,0xFF,0xFF,0x7F,0x00,0xC0,
	0xFF,0xFF,0x3F,0x00,0x80,0xFF,0xFF,0x1F,
	0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
	0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
	0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
	0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
	0x00,0x00,0x00,0x00/*邮箱.bmp",0*/
  },
};

uint8_t icon_width[]={36,36,36,36,36};

const uint8_t SINGAL[] = 
{
	0x00,0x00,0x80,0x01,0x80,0x01,0x80,0x01,
	0xB0,0x01,0xB0,0x01,0xB6,0x01,0xB6,0x01,
	0xB6,0x01,0x00,0x00,/*"D:\DeskTop\信号.bmp",0*/
};


const uint8_t WIFI[] = 
{
	0xF8,0x07,0xFC,0x1F,0x0E,0x1C,0x03,0x30,
	0xF1,0x23,0xF8,0x07,0x08,0x04,0xC0,0x00,
	0xC0,0x00,0x00,0x00,/*"D:\DeskTop\WIFI.bmp",0*/
};

const uint8_t SUCCESS_ICON[] = 
{
	0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
	0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
	0x00,0x00,0x00,0x18,0x00,0x00,0x00,0x3C,
	0x00,0x00,0x00,0x7E,0x00,0x00,0x00,0x3F,
	0x00,0x00,0x80,0x1F,0x00,0x00,0xC0,0x0F,
	0x00,0x00,0xE0,0x07,0x00,0x00,0xF0,0x03,
	0x00,0x00,0xF8,0x01,0x00,0x00,0xFC,0x00,
	0x08,0x00,0x7E,0x00,0x1C,0x00,0x3F,0x00,
	0x3E,0x80,0x1F,0x00,0x7E,0xC0,0x0F,0x00,
	0xFC,0xE0,0x07,0x00,0xF8,0xF1,0x03,0x00,
	0xF0,0xFB,0x01,0x00,0xE0,0xFF,0x00,0x00,
	0xC0,0x7F,0x00,0x00,0x80,0x3F,0x00,0x00,
	0x00,0x1F,0x00,0x00,0x00,0x0E,0x00,0x00,
	0x00,0x04,0x00,0x00,0x00,0x00,0x00,0x00,
	0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
	0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,/*"D:\DeskTop\success.bmp",0*/
};


const uint8_t WARNING[] = 
{

	0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
	0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xF0,0x00,0x00,0x00,0x00,0x00,0xF8,0x01,0x00,0x00,
	0x00,0x00,0xFC,0x03,0x00,0x00,0x00,0x00,0xFE,0x07,0x00,0x00,0x00,0x00,0xFE,0x07,0x00,0x00,0x00,0x00,0xFF,0x0F,0x00,0x00,
	0x00,0x80,0xFF,0x1F,0x00,0x00,0x00,0x80,0xFF,0x1F,0x00,0x00,0x00,0xC0,0x0F,0x3F,0x00,0x00,0x00,0xC0,0x0F,0x3F,0x00,0x00,
	0x00,0xE0,0x0F,0x7F,0x00,0x00,0x00,0xF0,0x0F,0xFF,0x00,0x00,0x00,0xF0,0x0F,0xFF,0x00,0x00,0x00,0xF8,0x0F,0xFF,0x01,0x00,
	0x00,0xF8,0x0F,0xFF,0x01,0x00,0x00,0xFC,0x0F,0xFF,0x03,0x00,0x00,0xFC,0x0F,0xFF,0x07,0x00,0x00,0xFE,0x0F,0xFF,0x07,0x00,
	0x00,0xFF,0x0F,0xFF,0x0F,0x00,0x00,0xFF,0x0F,0xFF,0x0F,0x00,0x80,0xFF,0x0F,0xFF,0x1F,0x00,0x80,0xFF,0x9F,0xFF,0x1F,0x00,
	0xC0,0xFF,0xFF,0xFF,0x3F,0x00,0xC0,0xFF,0xFF,0xFF,0x3F,0x00,0xE0,0xFF,0xFF,0xFF,0x7F,0x00,0xF0,0xFF,0x0F,0xFF,0xFF,0x00,
	0xF0,0xFF,0x0F,0xFF,0xFF,0x00,0xF0,0xFF,0x0F,0xFF,0xFF,0x00,0xF0,0xFF,0xDF,0xFF,0xFF,0x00,0xF0,0xFF,0xFF,0xFF,0xFF,0x00,
	0xE0,0xFF,0xFF,0xFF,0x7F,0x00,0xC0,0xFF,0xFF,0xFF,0x3F,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
	0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,/*"D:\DeskTop\warning-filling(1).bmp",0*/


};

//主页面LOGO
const uint8_t LOGO[]=
{
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xFF,0xFF,0xFF,0xFF,0x3F,0x00,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xC0,0xFF,0xFF,0xFF,0xFF,0xFF,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0xE0,0xFF,0xFF,0xFF,0xFF,0xFF,0x01,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x60,0x3E,0xFF,0xF3,0xFF,0xFF,0x01,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x60,0xFE,0xFF,0xF3,0xFF,0xFF,0x01,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x60,0x30,0x01,0x13,0x66,0xC2,0x01,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x60,0x32,0x49,0xF2,0x6C,0x9F,0x01,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x60,0x32,0x49,0x12,0x2C,0x83,0x01,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x60,0x32,0x49,0x92,0x0C,0x93,0x01,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x60,0x32,0x49,0x12,0x9C,0x83,0x01,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xE0,0xFF,0xFF,0xFF,0x9F,0xFF,0x01,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0xC0,0xFF,0xFF,0xFF,0xCF,0xFF,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xFE,0xFF,0xFF,0xFF,0x1F,0x00,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x1F,0x00,0x00,0x00,0x00,0x00,0x07,0x70,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xC0,0x7F,0x00,0x00,0x00,0x00,0x00,0x07,
0x70,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xC0,0x7F,0x00,0x00,0x00,0x00,0x00,0x07,0x70,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0xC0,0xF1,0x9C,0xF3,0xE0,0x87,0xDB,0x1F,0x70,0x0E,0x7C,0x38,0xE7,0xC1,0x07,0x00,0xC0,0x03,0xFC,0xFF,0xF1,0x8F,0xDF,0x1F,
0xF0,0x1F,0xFE,0xF9,0xFF,0xE3,0x0F,0x00,0xC0,0x3F,0xFC,0xFF,0xF9,0x8F,0x1F,0x07,0xF0,0x3F,0xFF,0xF9,0xFF,0x73,0x1C,0x00,
0x00,0xFF,0x3C,0xCF,0x01,0x8E,0x1F,0x07,0xF0,0x3C,0xC7,0x7B,0x9E,0xF3,0x1F,0x00,0x00,0xF0,0x1C,0xC7,0xF1,0x8F,0x07,0x07,
0x70,0x3C,0xC7,0x3B,0x8E,0xF3,0x3F,0x00,0xC0,0xE1,0x1C,0xC7,0x39,0x8E,0x03,0x07,0x70,0x3C,0xC7,0x3B,0x8E,0x73,0x00,0x00,
0xC0,0xFF,0x1C,0xC7,0xF9,0x8F,0x03,0x1F,0x70,0x3C,0xFF,0x39,0x8E,0xF3,0x1F,0x00,0x80,0x7F,0x1C,0xC7,0xF9,0x8F,0x03,0x1F,
0x70,0x3C,0xFE,0x39,0x8E,0xE3,0x1F,0x00,0x00,0x3F,0x1C,0xC7,0xF1,0x9E,0x03,0x1E,0x70,0x3C,0x7C,0x38,0x8E,0xC3,0x07,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,/*"D:\DeskTop\logo.bmp",0*/
};


#endif
