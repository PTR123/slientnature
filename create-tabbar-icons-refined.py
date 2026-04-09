#!/usr/bin/env python3
"""
Organic Geometry TabBar Icon Design - Refined Museum Quality
自然不语 - Nature Silent Miniprogram
Second Pass: Pristine execution with obsessive craftsmanship
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
plt.rcParams['axes.linewidth'] = 0

# Color palette - calibrated chromatic system (unchanged)
PRIMARY_GREEN = '#4a784a'
GRAY_NORMAL = '#8a8a8a'
GRAY_DARK = '#5a5a5a'
BACKGROUND = '#f8f7f5'
LABEL_GRAY = '#3a3a3a'

# Canvas dimensions - optimized for precision
WIDTH = 16
HEIGHT = 10
DPI = 400  # Increased DPI for print quality

# Font paths
FONT_PATH = '/Users/mac/.claude/skills/canvas-design/canvas-fonts/JetBrainsMono-Regular.ttf'
FONT_LABEL_CJK = FontProperties(family='Arial Unicode MS', size=11, weight='normal')
FONT_HEADER_CJK = FontProperties(family='Arial Unicode MS', size=14, weight='bold')
FONT_META = FontProperties(fname=FONT_PATH, size=9)

def create_leaf_icon(ax, x, y, size, color, alpha=1.0):
    """Geometric leaf - Fibonacci spiral meets botanical form - REFINED"""
    leaf_width = size * 0.44
    leaf_height = size * 0.68

    # More precise bezier curve - tighter control points
    verts = [
        (x, y - leaf_height*0.52),           # Bottom tip - extended
        (x - leaf_width*0.55, y - leaf_height*0.32),  # Left curve start
        (x - leaf_width, y + leaf_height*0.08),      # Left widest point
        (x - leaf_width*0.65, y + leaf_height*0.38),  # Left upper curve
        (x, y + leaf_height*0.52),          # Top tip - extended
        (x + leaf_width*0.65, y + leaf_height*0.38),  # Right upper curve
        (x + leaf_width, y + leaf_height*0.08),      # Right widest point
        (x + leaf_width*0.55, y - leaf_height*0.32),  # Right curve end
        (x, y - leaf_height*0.52),           # Close path
    ]

    codes = [Path.MOVETO, Path.CURVE3, Path.CURVE3, Path.CURVE3,
             Path.CURVE3, Path.CURVE3, Path.CURVE3, Path.CURVE3, Path.CLOSEPOLY]

    path = Path(verts, codes)
    leaf = patches.PathPatch(path, facecolor=color, edgecolor=color,
                             alpha=alpha, linewidth=0)
    ax.add_patch(leaf)

    # Central vein - logarithmic spiral - refined spacing
    vein_color = '#2a5a2a' if color == PRIMARY_GREEN else '#5a5a5a'
    vein_segments = 6
    for i in range(vein_segments):
        offset_y = y - leaf_height*0.52 + i * (leaf_height*1.04) / vein_segments
        offset_x_left = x - i * 0.072 * size
        offset_x_right = x + i * 0.072 * size
        ax.plot([offset_x_left, offset_x_right], [offset_y, offset_y],
                color=vein_color, linewidth=0.7, alpha=alpha*0.92)

def create_book_icon(ax, x, y, size, color, alpha=1.0):
    """Taxonomic catalog - systematic documentation form - REFINED"""
    book_width = size * 0.54
    book_height = size * 0.64

    # More precise rectangle with subtler rounding
    rect = patches.FancyBboxPatch((x - book_width/2, y - book_height/2),
                                   book_width, book_height,
                                   boxstyle="round,pad=0.015,rounding_size=0.03",
                                   facecolor=color, edgecolor=color,
                                   alpha=alpha, linewidth=0)
    ax.add_patch(rect)

    # Species card slots - systematic arrangement - refined spacing
    card_color = '#3a6a3a' if color == PRIMARY_GREEN else '#6a6a6a'
    card_spacing = (book_height - 0.2) / 3.2

    for i in range(3):
        card_y = y - book_height/2 + 0.1 + i * card_spacing
        card = patches.Rectangle((x - book_width/2 + 0.04, card_y),
                                  book_width - 0.08, 0.11,
                                  facecolor=card_color, edgecolor=card_color,
                                  alpha=alpha*0.28, linewidth=0,
                                  capstyle='round')
        ax.add_patch(card)

    # Catalog binding line - refined thickness
    ax.plot([x - book_width/2 - 0.018, x - book_width/2 - 0.018],
            [y - book_height/2 + 0.02, y + book_height/2 - 0.02],
            color=color, linewidth=1.3, alpha=alpha)

def create_community_icon(ax, x, y, size, color, alpha=1.0):
    """Biological clustering - organic community structure - REFINED"""
    node_size = size * 0.21

    # More organic triangular arrangement - golden ratio spacing
    positions = [
        (x - size*0.27, y + size*0.11),   # Upper left - subtle adjustment
        (x + size*0.27, y + size*0.11),   # Upper right - subtle adjustment
        (x, y - size*0.24)                 # Lower center - subtle adjustment
    ]

    for pos_x, pos_y in positions:
        # Perfect circles - no distortion
        circle = patches.Circle((pos_x, pos_y), node_size,
                                facecolor=color, edgecolor=color,
                                alpha=alpha, linewidth=0)
        ax.add_patch(circle)

    # Connection threads - refined opacity
    thread_color = '#3a6a3a' if color == PRIMARY_GREEN else '#7a7a7a'
    for i in range(len(positions)):
        for j in range(i+1, len(positions)):
            ax.plot([positions[i][0], positions[j][0]],
                    [positions[i][1], positions[j][1]],
                    color=thread_color, linewidth=1.1, alpha=alpha*0.38)

def create_profile_icon(ax, x, y, size, color, alpha=1.0):
    """Individual organism - cellular presence - REFINED"""
    head_radius = size * 0.21
    head_center_y = y + size*0.12

    # Perfect circle for head
    head = patches.Circle((x, head_center_y), head_radius,
                          facecolor=color, edgecolor=color,
                          alpha=alpha, linewidth=0)
    ax.add_patch(head)

    # Body - refined elliptical proportions
    body_width = size * 0.34
    body_height = size * 0.27
    body_center_y = y - size*0.19

    ellipse = patches.Ellipse((x, body_center_y), body_width, body_height,
                              facecolor=color, edgecolor=color,
                              alpha=alpha, linewidth=0)
    ax.add_patch(ellipse)

def create_composition():
    """Create museum-quality artifact with obsessive craftsmanship - REFINED"""

    fig = plt.figure(figsize=(WIDTH, HEIGHT), dpi=DPI, facecolor=BACKGROUND)
    ax = fig.add_subplot(111)
    ax.set_xlim(0, WIDTH)
    ax.set_ylim(0, HEIGHT)
    ax.set_aspect('equal')
    ax.axis('off')

    # === Header Section - Minimal scientific annotation ===
    ax.text(1.8, 8.72, '自然不语', fontproperties=FONT_HEADER_CJK,
            color=LABEL_GRAY, alpha=0.88, ha='left', va='center')
    ax.text(1.8, 8.42, 'Organic Geometry Interface System',
            fontproperties=FONT_META, color=LABEL_GRAY,
            alpha=0.58, ha='left', va='center')
    ax.text(1.8, 8.18, 'TaxBar Icon Specimens — Dormancy State',
            fontproperties=FONT_META, color=GRAY_NORMAL,
            alpha=0.48, ha='left', va='center')

    # === Grid Reference Lines - Invisible structure ===
    # Subtle vertical markers - structural rhythm
    for i in [2, 5, 8, 11]:
        ax.axvline(x=i, ymin=0.32, ymax=0.76,
                   color=LABEL_GRAY, alpha=0.06, linewidth=0.4)

    # === Normal State Icons - Dormancy expression ===
    icon_size = 1.82
    y_normal = 6.52

    # Spacing - golden ratio derivative
    icon_spacing = 3.0

    # 馴页 - Leaf specimen
    create_leaf_icon(ax, 2, y_normal, icon_size, GRAY_NORMAL, alpha=0.90)
    ax.text(2, y_normal - icon_size/2 - 0.34, '馴页',
            fontproperties=FONT_LABEL_CJK, color=GRAY_DARK,
            alpha=0.68, ha='center', va='top')
    ax.text(2, y_normal - icon_size/2 - 0.54, 'HOME',
            fontproperties=FONT_META, color=GRAY_NORMAL,
            alpha=0.48, ha='center', va='top', size=8)

    # 图鉴 - Book specimen
    create_book_icon(ax, 2 + icon_spacing, y_normal, icon_size, GRAY_NORMAL, alpha=0.90)
    ax.text(2 + icon_spacing, y_normal - icon_size/2 - 0.34, '图鉴',
            fontproperties=FONT_LABEL_CJK, color=GRAY_DARK,
            alpha=0.68, ha='center', va='top')
    ax.text(2 + icon_spacing, y_normal - icon_size/2 - 0.54, 'CATALOG',
            fontproperties=FONT_META, color=GRAY_NORMAL,
            alpha=0.48, ha='center', va='top', size=8)

    # 社区 - Community specimen
    create_community_icon(ax, 2 + 2*icon_spacing, y_normal, icon_size, GRAY_NORMAL, alpha=0.90)
    ax.text(2 + 2*icon_spacing, y_normal - icon_size/2 - 0.34, '社区',
            fontproperties=FONT_LABEL_CJK, color=GRAY_DARK,
            alpha=0.68, ha='center', va='top')
    ax.text(2 + 2*icon_spacing, y_normal - icon_size/2 - 0.54, 'COMMUNITY',
            fontproperties=FONT_META, color=GRAY_NORMAL,
            alpha=0.48, ha='center', va='top', size=8)

    # 我的 - Profile specimen
    create_profile_icon(ax, 2 + 3*icon_spacing, y_normal, icon_size, GRAY_NORMAL, alpha=0.90)
    ax.text(2 + 3*icon_spacing, y_normal - icon_size/2 - 0.34, '我的',
            fontproperties=FONT_LABEL_CJK, color=GRAY_DARK,
            alpha=0.68, ha='center', va='top')
    ax.text(2 + 3*icon_spacing, y_normal - icon_size/2 - 0.54, 'PROFILE',
            fontproperties=FONT_META, color=GRAY_NORMAL,
            alpha=0.48, ha='center', va='top', size=8)

    # === Separator - Breathing space ===
    ax.axhline(y=5.18, xmin=1.2/WIDTH, xmax=12.8/WIDTH,
               color=LABEL_GRAY, alpha=0.12, linewidth=0.8)

    ax.text(1.8, 5.02, 'Activated State — Chlorophyll Expression',
            fontproperties=FONT_META, color=PRIMARY_GREEN,
            alpha=0.58, ha='left', va='center', size=9)

    # === Selected State Icons - Vitality expression ===
    y_selected = 3.48

    # 馴页 - Leaf (activated)
    create_leaf_icon(ax, 2, y_selected, icon_size, PRIMARY_GREEN, alpha=0.94)
    ax.text(2, y_selected - icon_size/2 - 0.34, '馴页',
            fontproperties=FONT_LABEL_CJK, color=PRIMARY_GREEN,
            alpha=0.82, ha='center', va='top')
    ax.text(2, y_selected - icon_size/2 - 0.54, '#4a784a',
            fontproperties=FONT_META, color=PRIMARY_GREEN,
            alpha=0.58, ha='center', va='top', size=8)

    # 图鉴 - Book (activated)
    create_book_icon(ax, 2 + icon_spacing, y_selected, icon_size, PRIMARY_GREEN, alpha=0.94)
    ax.text(2 + icon_spacing, y_selected - icon_size/2 - 0.34, '图鉴',
            fontproperties=FONT_LABEL_CJK, color=PRIMARY_GREEN,
            alpha=0.82, ha='center', va='top')
    ax.text(2 + icon_spacing, y_selected - icon_size/2 - 0.54, '#4a784a',
            fontproperties=FONT_META, color=PRIMARY_GREEN,
            alpha=0.58, ha='center', va='top', size=8)

    # 社区 - Community (activated)
    create_community_icon(ax, 2 + 2*icon_spacing, y_selected, icon_size, PRIMARY_GREEN, alpha=0.94)
    ax.text(2 + 2*icon_spacing, y_selected - icon_size/2 - 0.34, '社区',
            fontproperties=FONT_LABEL_CJK, color=PRIMARY_GREEN,
            alpha=0.82, ha='center', va='top')
    ax.text(2 + 2*icon_spacing, y_selected - icon_size/2 - 0.54, '#4a784a',
            fontproperties=FONT_META, color=PRIMARY_GREEN,
            alpha=0.58, ha='center', va='top', size=8)

    # 我的 - Profile (activated)
    create_profile_icon(ax, 2 + 3*icon_spacing, y_selected, icon_size, PRIMARY_GREEN, alpha=0.94)
    ax.text(2 + 3*icon_spacing, y_selected - icon_size/2 - 0.34, '我的',
            fontproperties=FONT_LABEL_CJK, color=PRIMARY_GREEN,
            alpha=0.82, ha='center', va='top')
    ax.text(2 + 3*icon_spacing, y_selected - icon_size/2 - 0.54, '#4a784a',
            fontproperties=FONT_META, color=PRIMARY_GREEN,
            alpha=0.58, ha='center', va='top', size=8)

    # === Specimen Markers - Scientific reference system ===
    for i in range(4):
        marker_x = 2 + i * icon_spacing
        # Upper reference - refined positioning
        ax.plot(marker_x, 7.32, marker='o', markersize=2.5,
                color=LABEL_GRAY, alpha=0.28, markeredgewidth=0)
        ax.text(marker_x + 0.14, 7.32, f'S-{i+1:02d}',
                fontproperties=FONT_META, color=LABEL_GRAY,
                alpha=0.28, ha='left', va='center', size=7)
        # Lower reference
        ax.plot(marker_x, 2.52, marker='o', markersize=2.5,
                color=PRIMARY_GREEN, alpha=0.38, markeredgewidth=0)
        ax.text(marker_x + 0.14, 2.52, f'A-{i+1:02d}',
                fontproperties=FONT_META, color=PRIMARY_GREEN,
                alpha=0.38, ha='left', va='center', size=7)

    # === Footer - Minimal attribution ===
    ax.text(14.2, 1.52, 'ORGANIC', fontproperties=FONT_META,
            color=LABEL_GRAY, alpha=0.28, ha='right', va='center', size=8)
    ax.text(14.2, 1.32, 'GEOMETRY', fontproperties=FONT_META,
            color=PRIMARY_GREEN, alpha=0.38, ha='right', va='center', size=8)
    ax.text(14.2, 1.12, 'Interface System', fontproperties=FONT_META,
            color=LABEL_GRAY, alpha=0.24, ha='right', va='center', size=7)

    # Precision markers - invisible craftsmanship
    ax.plot(14.6, 1.52, marker='s', markersize=1.8,
            color=LABEL_GRAY, alpha=0.12, markeredgewidth=0)
    ax.plot(14.6, 1.32, marker='s', markersize=1.8,
            color=PRIMARY_GREEN, alpha=0.18, markeredgewidth=0)

    plt.tight_layout(pad=0.4)
    return fig

# Generate artifact - pristine execution
fig = create_composition()
fig.savefig('/Users/mac/zrby/tabbar-icons.pdf',
            format='pdf', dpi=DPI, facecolor=BACKGROUND,
            bbox_inches='tight', pad_inches=0.28)
fig.savefig('/Users/mac/zrby/tabbar-icons.png',
            format='png', dpi=DPI, facecolor=BACKGROUND,
            bbox_inches='tight', pad_inches=0.28)

print("✓ Pristine museum-quality icon specimens generated")
print("  → /Users/mac/zrby/tabbar-icons.pdf")
print("  → /Users/mac/zrby/tabbar-icons.png")