#ifndef __BASE_H
#define __BASE_H

#include <stdint.h>
#include "u8g2.h"
static char _str_[16];

extern u8g2_t u8g2;

#define _str_w_(str) 			  u8g2_GetStrWidth(&u8g2, str)  // string width
#define _draw_str(x, y, str)      u8g2_DrawStr(&u8g2, x, y, str)
#define _draw_num(x, y, fmt, num) sprintf(_str_, fmt, num), _draw_str(x, y, _str_)

#define _draw_pixel(x, y)          u8g2_DrawPixel(&u8g2, x, y);
#define _draw_hline(x, y, w)       u8g2_DrawHLine(&u8g2, x, y, w)
#define _draw_vline(x, y, h)       u8g2_DrawVLine(&u8g2, x, y, h)
#define _draw_line(x1, y1, x2, y2) u8g2_DrawLine(&u8g2, x1, y1, x2, y2)

#define _draw_box(x, y, w, h)            u8g2_DrawBox(&u8g2, x, y, w, h)
#define _draw_Rbox(x, y, w, h, r) 		 u8g2_DrawRBox(&u8g2, x, y, w, h, r)

#define _draw_frame(x, y, w, h)            u8g2_DrawFrame(&u8g2, x, y, w, h)
#define _draw_Rframe(x, y, w, h, r) 		u8g2_DrawRFrame(&u8g2, x, y, w, h, r)

#define _draw_circle(x, y, r, md)                   u8g2_DrawCircle(&u8g2, x, y, r, md);
#define _draw_circle_full(x, y, r)                  u8g2_DrawCircle(&u8g2, x, y, r, U8G2_DRAW_ALL);
#define _draw_circle_full_at_screen_center(x, y, r) _draw_circle_full(64 + x, 32 + y, r);

#define _set_color(c) u8g2_SetDrawColor(&u8g2, c);

#define _clear()  u8g2_ClearBuffer(&u8g2)
#define _update() u8g2_SendBuffer(&u8g2)


void setup_u8g2(void);

#endif
