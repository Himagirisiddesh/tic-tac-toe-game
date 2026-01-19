# tic-tac-toe-game2
import pygame
import sys
import random
import math
import time

pygame.init()

# ================= WINDOW =================
WIDTH, HEIGHT = 520, 680
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("XOX – Ultimate Edition")
clock = pygame.time.Clock()
FPS = 60

# ================= COLORS =================
BG_TOP = (45, 55, 120)
BG_BOTTOM = (15, 18, 35)

BTN = (90, 120, 255)
BTN_HOVER = (140, 180, 255)

TXT = (255, 255, 255)
SUB = (200, 210, 255)

X_CLR = (0, 255, 200)
O_CLR = (255, 120, 160)
GRID = (180, 200, 255)
STRIKE = (255, 230, 120)

# ================= FONTS =================
title_font = pygame.font.SysFont("arialblack", 42)
font = pygame.font.SysFont("arialblack", 48)
small = pygame.font.SysFont("arial", 20)

# ================= GAME DATA =================
board = [""] * 9
cell = 120
grid_start_y = 260

mode = "menu"      # menu / symbol / difficulty / pvp / ai
player_symbol = "X"
ai_symbol = "O"
current_turn = "X"

TURN_LIMIT = 5
turn_start_time = time.time()

# ================= SCORES =================
score_x = 0
score_o = 0
score_draw = 0

# ================= STRIKE LINE =================
strike_line = None

# ================= PARTICLES =================
particles = []

class Particle:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.dx = random.uniform(-6, 6)
        self.dy = random.uniform(-8, -3)
        self.life = 40
        self.color = random.choice([X_CLR, O_CLR, STRIKE])

    def update(self):
        self.x += self.dx
        self.y += self.dy
        self.dy += 0.3
        self.life -= 1
        pygame.draw.circle(screen, self.color, (int(self.x), int(self.y)), 4)

# ================= HELPERS =================
def draw_background():
    for y in range(HEIGHT):
        ratio = y / HEIGHT
        r = BG_TOP[0] * (1 - ratio) + BG_BOTTOM[0] * ratio
        g = BG_TOP[1] * (1 - ratio) + BG_BOTTOM[1] * ratio
        b = BG_TOP[2] * (1 - ratio) + BG_BOTTOM[2] * ratio
        pygame.draw.line(screen, (int(r), int(g), int(b)), (0, y), (WIDTH, y))

def reset_board():
    global board, current_turn, turn_start_time, strike_line
    board = [""] * 9
    current_turn = player_symbol
    turn_start_time = time.time()
    strike_line = None
    particles.clear()

def draw_button(text, x, y, w, h):
    mx, my = pygame.mouse.get_pos()
    rect = pygame.Rect(x, y, w, h)
    color = BTN_HOVER if rect.collidepoint(mx, my) else BTN
    pygame.draw.rect(screen, color, rect, border_radius=24)
    label = small.render(text, True, TXT)
    screen.blit(label, (x + w//2 - label.get_width()//2,
                        y + h//2 - label.get_height()//2))
    return rect

# ================= GAME DRAW =================
def draw_grid():
    for i in range(1, 3):
        pygame.draw.line(screen, GRID,
            (WIDTH//2 - 180 + i*120, grid_start_y),
            (WIDTH//2 - 180 + i*120, grid_start_y + 360), 4)
        pygame.draw.line(screen, GRID,
            (WIDTH//2 - 180, grid_start_y + i*120),
            (WIDTH//2 + 180, grid_start_y + i*120), 4)

def draw_symbols():
    pulse = abs(math.sin(pygame.time.get_ticks() * 0.005)) * 6
    for i in range(9):
        x = WIDTH//2 - 120 + (i % 3) * 120
        y = grid_start_y + 60 + (i // 3) * 120
        if board[i] == "X":
            pygame.draw.line(screen, X_CLR,
                (x-30-pulse, y-30-pulse),
                (x+30+pulse, y+30+pulse), 6)
            pygame.draw.line(screen, X_CLR,
                (x+30+pulse, y-30-pulse),
                (x-30-pulse, y+30+pulse), 6)
        elif board[i] == "O":
            pygame.draw.circle(screen, O_CLR,
                (x, y), int(34+pulse), 6)

def draw_strike():
    if strike_line:
        glow = abs(math.sin(pygame.time.get_ticks() * 0.01)) * 6
        pygame.draw.line(screen, STRIKE,
            strike_line[0], strike_line[1], int(10 + glow))

# ================= GAME LOGIC =================
def check_win():
    global strike_line
    wins = [
        (0,1,2),(3,4,5),(6,7,8),
        (0,3,6),(1,4,7),(2,5,8),
        (0,4,8),(2,4,6)
    ]
    for a,b,c in wins:
        if board[a] == board[b] == board[c] != "":
            x1 = WIDTH//2 - 120 + (a % 3) * 120
            y1 = grid_start_y + 60 + (a // 3) * 120
            x2 = WIDTH//2 - 120 + (c % 3) * 120
            y2 = grid_start_y + 60 + (c // 3) * 120
            strike_line = ((x1, y1), (x2, y2))
            return board[a]
    if "" not in board:
        return "Draw"
    return None

def ai_move():
    empty = [i for i in range(9) if board[i] == ""]
    return random.choice(empty)

# ================= WIN ANIMATION =================
def win_animation(result):
    winner_color = X_CLR if result == "X" else O_CLR if result == "O" else STRIKE
    start = pygame.time.get_ticks()

    for _ in range(150):
        particles.append(Particle(WIDTH//2, HEIGHT//2))

    while pygame.time.get_ticks() - start < 1200:
        draw_background()
        draw_grid()
        draw_symbols()
        draw_strike()

        overlay = pygame.Surface((WIDTH, HEIGHT), pygame.SRCALPHA)
        overlay.fill((0,0,0,160))
        screen.blit(overlay, (0,0))

        scale = 1 + abs(math.sin(pygame.time.get_ticks() * 0.004)) * 0.25
        text = font.render(
            f"{result} WINS!" if result != "Draw" else "DRAW",
            True, winner_color
        )
        text = pygame.transform.scale(
            text,
            (int(text.get_width()*scale),
             int(text.get_height()*scale))
        )

        screen.blit(text, (
            WIDTH//2 - text.get_width()//2,
            HEIGHT//2 - text.get_height()//2
        ))

        for p in particles[:]:
            p.update()
            if p.life <= 0:
                particles.remove(p)

        pygame.display.update()
        clock.tick(60)

# ================= HANDLE WIN =================
def handle_win(result):
    global score_x, score_o, score_draw
    if result == "X": score_x += 1
    elif result == "O": score_o += 1
    else: score_draw += 1

    win_animation(result)
    reset_board()

# ================= MAIN LOOP =================
while True:
    clock.tick(FPS)
    draw_background()

    # ----- TITLE -----
    title = title_font.render("XOX GAME", True, TXT)
    screen.blit(title, (WIDTH//2 - title.get_width()//2, 30))

    # ----- SCORE ONLY IN GAME -----
    if mode in ["pvp","ai"]:
        score = small.render(
            f"X:{score_x}  O:{score_o}  Draw:{score_draw}",
            True, SUB)
        screen.blit(score, (WIDTH//2 - score.get_width()//2, 90))

        remaining = TURN_LIMIT - int(time.time() - turn_start_time)
        timer = small.render(
            f"Turn: {current_turn} | Time: {max(0,remaining)}s",
            True, TXT)
        screen.blit(timer, (WIDTH//2 - timer.get_width()//2, 120))

        if remaining <= 0:
            handle_win(ai_symbol if current_turn == player_symbol else player_symbol)

    # ----- EVENTS -----
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

        if event.type == pygame.MOUSEBUTTONDOWN:
            mx, my = pygame.mouse.get_pos()

            if mode == "menu":
                if btn_ai.collidepoint(mx,my): mode="symbol"
                if btn_pvp.collidepoint(mx,my):
                    player_symbol="X"; ai_symbol="O"
                    mode="pvp"; reset_board()

            elif mode == "symbol":
                if btn_x.collidepoint(mx,my):
                    player_symbol="X"; ai_symbol="O"
                    mode="ai"; reset_board()
                if btn_o.collidepoint(mx,my):
                    player_symbol="O"; ai_symbol="X"
                    mode="ai"; reset_board()

            elif mode in ["pvp","ai"]:
                if btn_back.collidepoint(mx,my):
                    mode="menu"; reset_board()

                elif my > grid_start_y:
                    col = (mx - (WIDTH//2 - 180)) // 120
                    row = (my - grid_start_y) // 120
                    idx = row*3 + col
                    if 0<=idx<9 and board[idx]=="":
                        board[idx]=current_turn
                        turn_start_time=time.time()
                        result = check_win()
                        if result: handle_win(result)
                        current_turn = ai_symbol if current_turn==player_symbol else player_symbol
                        if mode=="ai" and current_turn==ai_symbol:
                            pygame.time.delay(400)
                            board[ai_move()] = ai_symbol
                            result = check_win()
                            if result: handle_win(result)
                            current_turn = player_symbol
                            turn_start_time=time.time()

    # ----- UI -----
    if mode == "menu":
        btn_ai = draw_button("Play with Computer", WIDTH//2-150, 260, 300, 60)
        btn_pvp = draw_button("Play with Friend", WIDTH//2-150, 340, 300, 60)

    elif mode == "symbol":
        btn_x = draw_button("Play as X", WIDTH//2-150, 280, 300, 60)
        btn_o = draw_button("Play as O", WIDTH//2-150, 360, 300, 60)

    else:
        btn_back = draw_button("⬅ Back", 20, 220, 120, 48)
        draw_grid()
        draw_symbols()
        draw_strike()

    pygame.display.update()
