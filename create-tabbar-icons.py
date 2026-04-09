#!/usr/bin/env python3
"""
Organic Geometry TabBar Icon Design
自然不语 - Nature Silent Miniprogram
"""

import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.path import Path
import numpy as np
from matplotlib.font_manager import FontProperties
import math

# Configure matplotlib for CJK font support
plt.rcParams['font.family'] = ['sans-serif']
plt.rcParams['font.sans-serif'] = ['Arial Unicode MS', 'PingFang SC', 'Heiti SC', 'STHeiti', 'SimHei', 'DejaVu Sans']

# Color palette - calibrated chromatic system
PRIMARY_GREEN = '#4a784a'  # Chlorophyll absorption wavelength
GRAY_NORMAL = '#8a8a8a'    # Dormancy state
GRAY_DARK = '#5a5a5a'      # Deep dormancy
BACKGROUND = '#f8f7f5'     # Atmospheric canvas
LABEL_GRAY = '#3a3a3a'     # Scientific annotation

# Canvas dimensions
WIDTH = 16
HEIGHT = 10
DPI = 300

# Font paths - Western fonts for metadata, system fonts for CJK
FONT_PATH = '/Users/mac/.claude/skills/canvas-design/canvas-fonts/JetBrainsMono-Regular.ttf'
FONT_LABEL_CJK = FontProperties(family='Arial Unicode MS', size=11)
FONT_HEADER_CJK = FontProperties(family='Arial Unicode MS', size=13, weight='bold')
FONT_META = FontProperties(fname=FONT_PATH, size=9)

def create_leaf_icon(ax, x, y, size, color, alpha=1.0):
    """Geometric leaf - Fibonacci spiral meets botanical form"""
    # Main leaf body - elliptical form with mathematical precision
    leaf_width = size * 0.45
    leaf_height = size * 0.7

    # Create leaf shape using bezier curves
    verts = [
        (x, y - leaf_height/2),           # Bottom tip
        (x - leaf_width*0.6, y - leaf_height*0.3),  # Left curve
        (x - leaf_width, y + leaf_height*0.1),      # Left widest
        (x - leaf_width*0.7, y + leaf_height*0.4),  # Left upper
        (x, y + leaf_height/2),          # Top tip
        (x + leaf_width*0.7, y + leaf_height*0.4),  # Right upper
        (x + leaf_width, y + leaf_height*0.1),      # Right widest
        (x + leaf_width*0.6, y - leaf_height*0.3),  # Right curve
        (x, y - leaf_height/2),           # Close
    ]

    codes = [Path.MOVETO, Path.CURVE3, Path.CURVE3, Path.CURVE3,
             Path.CURVE3, Path.CURVE3, Path.CURVE3, Path.CURVE3, Path.CLOSEPOLY]

    path = Path(verts, codes)
    leaf = patches.PathPatch(path, facecolor=color, edgecolor=color,
                             alpha=alpha, linewidth=0)
    ax.add_patch(leaf)

    # Central vein - logarithmic spiral
    vein_color = '#2a5a2a' if color == PRIMARY_GREEN else '#5a5a5a'
    for i in range(5):
        offset_y = y - leaf_height/2 + i * leaf_height/6
        offset_x_left = x - i * 0.08 * size
        offset_x_right = x + i * 0.08 * size
        ax.plot([offset_x_left, offset_x_right], [offset_y, offset_y],
                color=vein_color, linewidth=0.8, alpha=alpha)

def create_book_icon(ax, x, y, size, color, alpha=1.0):
    """Taxonomic catalog - systematic documentation form"""
    book_width = size * 0.55
    book_height = size * 0.65

    # Main book body - rectangular precision
    rect = patches.FancyBboxPatch((x - book_width/2, y - book_height/2),
                                   book_width, book_height,
                                   boxstyle="round,pad=0.02,rounding_size=0.05",
                                   facecolor=color, edgecolor=color,
                                   alpha=alpha, linewidth=0)
    ax.add_patch(rect)

    # Species card slots - systematic arrangement
    card_color = '#3a6a3a' if color == PRIMARY_GREEN else '#6a6a6a'
    card_spacing = book_height / 5

    for i in range(3):
        card_y = y - book_height/2 + 0.1 + i * card_spacing
        card = patches.Rectangle((x - book_width/2 + 0.05, card_y),
                                  book_width - 0.1, 0.12,
                                  facecolor=card_color, edgecolor=card_color,
                                  alpha=alpha*0.3, linewidth=0)
        ax.add_patch(card)

    # Catalog binding line - structural element
    ax.plot([x - book_width/2 - 0.02, x - book_width/2 - 0.02],
            [y - book_height/2, y + book_height/2],
            color=color, linewidth=1.5, alpha=alpha)

def create_community_icon(ax, x, y, size, color, alpha=1.0):
    """Biological clustering - organic community structure"""
    # Three conversation nodes in organic arrangement
    node_size = size * 0.22
    positions = [
        (x - size*0.28, y + size*0.12),   # Upper left
        (x + size*0.28, y + size*0.12),   # Upper right
        (x, y - size*0.25)                 # Lower center
    ]

    for pos_x, pos_y in positions:
        # Organic circular form - not perfect circle
        circle = patches.Circle((pos_x, pos_y), node_size,
                                facecolor=color, edgecolor=color,
                                alpha=alpha, linewidth=0)
        ax.add_patch(circle)

    # Connection threads - invisible networks
    thread_color = '#3a6a3a' if color == PRIMARY_GREEN else '#7a7a7a'
    for i in range(len(positions)):
        for j in range(i+1, len(positions)):
            ax.plot([positions[i][0], positions[j][0]],
                    [positions[i][1], positions[j][1]],
                    color=thread_color, linewidth=1.2, alpha=alpha*0.4,
                    linestyle='-')

def create_profile_icon(ax, x, y, size, color, alpha=1.0):
    """Individual organism - cellular presence"""
    # Head - circular cell structure
    head_radius = size * 0.22
    head_center = (x, y + size*0.12)
    head = patches.Circle(head_center, head_radius,
                          facecolor=color, edgecolor=color,
                          alpha=alpha, linewidth=0)
    ax.add_patch(head)

    # Body - organic elliptical form
    body_width = size * 0.35
    body_height = size * 0.28
    body_center_y = y - size*0.2

    ellipse = patches.Ellipse((x, body_center_y), body_width, body_height,
                              facecolor=color, edgecolor=color,
                              alpha=alpha, linewidth=0)
    ax.add_patch(ellipse)

def create_composition():
    """Create museum-quality artifact with obsessive craftsmanship"""

    fig = plt.figure(figsize=(WIDTH, HEIGHT), dpi=DPI, facecolor=BACKGROUND)
    ax = fig.add_subplot(111)
    ax.set_xlim(0, WIDTH)
    ax.set_ylim(0, HEIGHT)
    ax.set_aspect('equal')
    ax.axis('off')

    # === Header Section - Minimal scientific annotation ===
    ax.text(2, 8.7, '自然不语', fontproperties=FONT_HEADER_CJK,
            color=LABEL_GRAY, alpha=0.9, ha='left')
    ax.text(2, 8.4, 'Organic Geometry Interface System',
            fontproperties=FONT_META, color=LABEL_GRAY,
            alpha=0.6, ha='left')
    ax.text(2, 8.15, 'TaxBar Icon Specimens — Normal State',
            fontproperties=FONT_META, color=GRAY_NORMAL,
            alpha=0.5, ha='left')

    # === Grid Reference Lines - Invisible structure ===
    for i in [2, 4, 6, 8, 10, 12]:
        ax.axhline(y=6.5, xmin=0.125, xmax=0.75,
                   color=LABEL_GRAY, alpha=0.08, linewidth=0.5)
        ax.axhline(y=3.5, xmin=0.125, xmax=0.75,
                   color=LABEL_GRAY, alpha=0.08, linewidth=0.5)

    # === Normal State Icons - Dormancy expression ===
    icon_size = 1.8
    y_normal = 6.5

    # 馴页 - Leaf specimen
    create_leaf_icon(ax, 2, y_normal, icon_size, GRAY_NORMAL, alpha=0.92)
    ax.text(2, y_normal - icon_size/2 - 0.35, '馴页',
            fontproperties=FONT_LABEL_CJK, color=GRAY_DARK,
            alpha=0.7, ha='center', va='top')
    ax.text(2, y_normal - icon_size/2 - 0.55, 'HOME',
            fontproperties=FONT_META, color=GRAY_NORMAL,
            alpha=0.5, ha='center', va='top', size=8)

    # 图鉴 - Book specimen
    create_book_icon(ax, 5, y_normal, icon_size, GRAY_NORMAL, alpha=0.92)
    ax.text(5, y_normal - icon_size/2 - 0.35, '图鉴',
            fontproperties=FONT_LABEL_CJK, color=GRAY_DARK,
            alpha=0.7, ha='center', va='top')
    ax.text(5, y_normal - icon_size/2 - 0.55, 'CATALOG',
            fontproperties=FONT_META, color=GRAY_NORMAL,
            alpha=0.5, ha='center', va='top', size=8)

    # 社区 - Community specimen
    create_community_icon(ax, 8, y_normal, icon_size, GRAY_NORMAL, alpha=0.92)
    ax.text(8, y_normal - icon_size/2 - 0.35, '社区',
            fontproperties=FONT_LABEL_CJK, color=GRAY_DARK,
            alpha=0.7, ha='center', va='top')
    ax.text(8, y_normal - icon_size/2 - 0.55, 'COMMUNITY',
            fontproperties=FONT_META, color=GRAY_NORMAL,
            alpha=0.5, ha='center', va='top', size=8)

    # 我的 - Profile specimen
    create_profile_icon(ax, 11, y_normal, icon_size, GRAY_NORMAL, alpha=0.92)
    ax.text(11, y_normal - icon_size/2 - 0.35, '我的',
            fontproperties=FONT_LABEL_CJK, color=GRAY_DARK,
            alpha=0.7, ha='center', va='top')
    ax.text(11, y_normal - icon_size/2 - 0.55, 'PROFILE',
            fontproperties=FONT_META, color=GRAY_NORMAL,
            alpha=0.5, ha='center', va='top', size=8)

    # === Separator - Breathing space ===
    ax.axhline(y=5.2, xmin=1.5/WIDTH, xmax=12.5/WIDTH,
               color=LABEL_GRAY, alpha=0.15, linewidth=1)

    ax.text(2, 5.0, 'Activated State — Chlorophyll Expression',
            fontproperties=FONT_META, color=PRIMARY_GREEN,
            alpha=0.6, ha='left', size=9)

    # === Selected State Icons - Vitality expression ===
    y_selected = 3.5

    # 馴页 - Leaf (activated)
    create_leaf_icon(ax, 2, y_selected, icon_size, PRIMARY_GREEN, alpha=0.95)
    ax.text(2, y_selected - icon_size/2 - 0.35, '馴页',
            fontproperties=FONT_LABEL_CJK, color=PRIMARY_GREEN,
            alpha=0.85, ha='center', va='top')
    ax.text(2, y_selected - icon_size/2 - 0.55, '#4a784a',
            fontproperties=FONT_META, color=PRIMARY_GREEN,
            alpha=0.6, ha='center', va='top', size=8)

    # 图鉴 - Book (activated)
    create_book_icon(ax, 5, y_selected, icon_size, PRIMARY_GREEN, alpha=0.95)
    ax.text(5, y_selected - icon_size/2 - 0.35, '图鉴',
            fontproperties=FONT_LABEL_CJK, color=PRIMARY_GREEN,
            alpha=0.85, ha='center', va='top')
    ax.text(5, y_selected - icon_size/2 - 0.55, '#4a784a',
            fontproperties=FONT_META, color=PRIMARY_GREEN,
            alpha=0.6, ha='center', va='top', size=8)

    # 社区 - Community (activated)
    create_community_icon(ax, 8, y_selected, icon_size, PRIMARY_GREEN, alpha=0.95)
    ax.text(8, y_selected - icon_size/2 - 0.35, '社区',
            fontproperties=FONT_LABEL_CJK, color=PRIMARY_GREEN,
            alpha=0.85, ha='center', va='top')
    ax.text(8, y_selected - icon_size/2 - 0.55, '#4a784a',
            fontproperties=FONT_META, color=PRIMARY_GREEN,
            alpha=0.6, ha='center', va='top', size=8)

    # 我的 - Profile (activated)
    create_profile_icon(ax, 11, y_selected, icon_size, PRIMARY_GREEN, alpha=0.95)
    ax.text(11, y_selected - icon_size/2 - 0.35, '我的',
            fontproperties=FONT_LABEL_CJK, color=PRIMARY_GREEN,
            alpha=0.85, ha='center', va='top')
    ax.text(11, y_selected - icon_size/2 - 0.55, '#4a784a',
            fontproperties=FONT_META, color=PRIMARY_GREEN,
            alpha=0.6, ha='center', va='top', size=8)

    # === Specimen Markers - Scientific reference system ===
    marker_spacing = 2.8
    for i in range(4):
        marker_x = 2 + i * 3
        # Upper reference
        ax.plot(marker_x, 7.3, marker='o', markersize=3,
                color=LABEL_GRAY, alpha=0.3)
        ax.text(marker_x + 0.15, 7.3, f'S-{i+1:02d}',
                fontproperties=FONT_META, color=LABEL_GRAY,
                alpha=0.3, ha='left', va='center', size=7)
        # Lower reference
        ax.plot(marker_x, 2.5, marker='o', markersize=3,
                color=PRIMARY_GREEN, alpha=0.4)
        ax.text(marker_x + 0.15, 2.5, f'A-{i+1:02d}',
                fontproperties=FONT_META, color=PRIMARY_GREEN,
                alpha=0.4, ha='left', va='center', size=7)

    # === Footer - Minimal attribution ===
    ax.text(14, 1.5, 'ORGANIC', fontproperties=FONT_META,
            color=LABEL_GRAY, alpha=0.3, ha='right', size=8)
    ax.text(14, 1.3, 'GEOMETRY', fontproperties=FONT_META,
            color=PRIMARY_GREEN, alpha=0.4, ha='right', size=8)
    ax.text(14, 1.1, 'Interface System', fontproperties=FONT_META,
            color=LABEL_GRAY, alpha=0.25, ha='right', size=7)

    # Precision markers - invisible craftsmanship
    ax.plot(14.5, 1.5, marker='s', markersize=2,
            color=LABEL_GRAY, alpha=0.15)
    ax.plot(14.5, 1.3, marker='s', markersize=2,
            color=PRIMARY_GREEN, alpha=0.2)

    plt.tight_layout(pad=0.5)
    return fig

# Generate artifact
fig = create_composition()
fig.savefig('/Users/mac/zrby/tabbar-icons.pdf',
            format='pdf', dpi=DPI, facecolor=BACKGROUND,
            bbox_inches='tight', pad_inches=0.3)
fig.savefig('/Users/mac/zrby/tabbar-icons.png',
            format='png', dpi=DPI, facecolor=BACKGROUND,
            bbox_inches='tight', pad_inches=0.3)

print("✓ Museum-quality icon specimens generated")
print("  → /Users/mac/zrby/tabbar-icons.pdf")
print("  → /Users/mac/zrby/tabbar-icons.png")