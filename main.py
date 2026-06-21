import pygame
import chess

# Constants
WIDTH = 640
HEIGHT = 640
DIMENSION = 8
SQ_SIZE = WIDTH // DIMENSION

# Initialize Pygame
pygame.init()
screen = pygame.display.set_mode((WIDTH, HEIGHT))
board = chess.Board()
font = pygame.font.SysFont("Arial", 32, bold=True)

def draw_board(screen):
    colors = [pygame.Color("white"), pygame.Color("gray")]
    for r in range(DIMENSION):
        for c in range(DIMENSION):
            color = colors[((r + c) % 2)]
            pygame.draw.rect(screen, color, pygame.Rect(c*SQ_SIZE, r*SQ_SIZE, SQ_SIZE, SQ_SIZE))

def draw_pieces(screen, board):
    for r in range(DIMENSION):
        for c in range(DIMENSION):
            square = chess.square(c, 7 - r)
            piece = board.piece_at(square)
            if piece:
                # পিসের রঙ ও নাম নির্ধারণ
                color = "white" if piece.color == chess.WHITE else "black"
                symbol = piece.unicode_symbol()
                
                # পিস ড্র করার জন্য টেক্সট রেন্ডার
                text = font.render(symbol, True, pygame.Color(color))
                # টেক্সটটি ঘরের মাঝখানে বসানোর জন্য
                text_rect = text.get_rect(center=(c*SQ_SIZE + SQ_SIZE//2, r*SQ_SIZE + SQ_SIZE//2))
                screen.blit(text, text_rect)

def main():
    running = True
    selected_square = None
    
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.MOUSEBUTTONDOWN:
                location = pygame.mouse.get_pos()
                col = location[0] // SQ_SIZE
                row = 7 - (location[1] // SQ_SIZE)
                square = chess.square(col, row)
                
                if selected_square is None:
                    if board.piece_at(square):
                        selected_square = square
                else:
                    move = chess.Move(selected_square, square, promotion=chess.QUEEN)
                    if move in board.legal_moves:
                        board.push(move)
                    selected_square = None

        draw_board(screen)
        draw_pieces(screen, board)
        pygame.display.flip()

    pygame.quit()

if __name__ == "__main__":
    main()
