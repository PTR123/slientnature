#!/usr/bin/env python3
"""
Generate individual TabBar icon PNGs for WeChat Miniprogram
Each icon: 81x81 pixels, two states (normal & selected)
"""

import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.path import Path
import numpy as np
import os

# Configure matplotlib for CJK font support
plt.rcParams['font.family'] = ['sans-serif']
plt.rcParams['font.sans-serif'] = ['Arial Unicode MS', 'PingFang SC', 'Heiti SC', 'STHeiti', 'SimHei', 'DejaVu Sans']

# Color palette
PRIMARY_GREEN = '#4a784a'
GRAY_NORMAL = '#8a8a8a'

# Icon dimensions for WeChat miniprogram
ICON_SIZE = 81  # WeChat recommends 81x81 px
DPI = 300

def create_leaf_icon(ax, size, color):
    """Geometric leaf - Fibonacci spiral meets botanical form"""
    leaf_width = size * 0.44
    leaf_height = size * 0.68

    verts = [
        (size/2, size/2 - leaf_height*0.52),
        (size/2 - leaf_width*0.55, size/2 - leaf_height*0.32),
        (size/2 - leaf_width, size/2 + leaf_height*0.08),
        (size/2 - leaf_width*0.65, size/2 + leaf_height*0.38),
        (size/2, size/2 + leaf_height*0.52),
        (size/2 + leaf_width*0.65, size/2 + leaf_height*0.38),
        (size/2 + leaf_width, size/2 + leaf_height*0.08),
        (size/2 + leaf_width*0.55, size/2 - leaf_height*0.32),
        (size/2, size/2 - leaf_height*0.52),
    ]

    codes = [Path.MOVETO, Path.CURVE3, Path.CURVE3, Path.CURVE3,
             Path.CURVE3, Path.CURVE3, Path.CURVE3, Path.CURVE3, Path.CLOSEPOLY]

    path = Path(verts, codes)
    leaf = patches.PathPatch(path, facecolor=color, edgecolor=color,
                             alpha=0.92, linewidth=0)
    ax.add_patch(leaf)

    vein_color = '#2a5a2a' if color == PRIMARY_GREEN else '#5a5a5a'
    vein_segments = 6
    for i in range(vein_segments):
        offset_y = size/2 - leaf_height*0.52 + i * (leaf_height*1.04) / vein_segments
        offset_x_left = size/2 - i * 0.072 * size
        offset_x_right = size/2 + i * 0.072 * size
        ax.plot([offset_x_left, offset_x_right], [offset_y, offset_y],
                color=vein_color, linewidth=0.7, alpha=0.92)

def create_book_icon(ax, size, color):
    """Taxonomic catalog - systematic documentation form"""
    book_width = size * 0.54
    book_height = size * 0.64

    rect = patches.FancyBboxPatch((size/2 - book_width/2, size/2 - book_height/2),
                                   book_width, book_height,
                                   boxstyle="round,pad=0.015,rounding_size=0.03",
                                   facecolor=color, edgecolor=color,
                                   alpha=0.92, linewidth=0)
    ax.add_patch(rect)

    card_color = '#3a6a3a' if color == PRIMARY_GREEN else '#6a6a6a'
    card_spacing = (book_height - 0.2) / 3.2

    for i in range(3):
        card_y = size/2 - book_height/2 + 0.1 + i * card_spacing
        card = patches.Rectangle((size/2 - book_width/2 + 0.04, card_y),
                                  book_width - 0.08, 0.11,
                                  facecolor=card_color, edgecolor=card_color,
                                  alpha=0.28, linewidth=0)
        ax.add_patch(card)

    ax.plot([size/2 - book_width/2 - 0.018, size/2 - book_width/2 - 0.018],
            [size/2 - book_height/2 + 0.02, size/2 + book_height/2 - 0.02],
            color=color, linewidth=1.3, alpha=0.92)

def create_community_icon(ax, size, color):
    """Biological clustering - organic community structure"""
    node_size = size * 0.21

    positions = [
        (size/2 - size*0.27, size/2 + size*0.11),
        (size/2 + size*0.27, size/2 + size*0.11),
        (size/2, size/2 - size*0.24)
    ]

    for pos_x, pos_y in positions:
        circle = patches.Circle((pos_x, pos_y), node_size,
                                facecolor=color, edgecolor=color,
                                alpha=0.92, linewidth=0)
        ax.add_patch(circle)

    thread_color = '#3a6a3a' if color == PRIMARY_GREEN else '#7a7a7a'
    for i in range(len(positions)):
        for j in range(i+1, len(positions)):
            ax.plot([positions[i][0], positions[j][0]],
                    [positions[i][1], positions[j][1]],
                    color=thread_color, linewidth=1.1, alpha=0.38)

def create_profile_icon(ax, size, color):
    """Individual organism - cellular presence"""
    head_radius = size * 0.21
    head_center_y = size/2 + size*0.12

    head = patches.Circle((size/2, head_center_y), head_radius,
                          facecolor=color, edgecolor=color,
                          alpha=0.92, linewidth=0)
    ax.add_patch(head)

    body_width = size * 0.34
    body_height = size * 0.27
    body_center_y = size/2 - size*0.19

    ellipse = patches.Ellipse((size/2, body_center_y), body_width, body_height,
                              facecolor=color, edgecolor=color,
                              alpha=0.92, linewidth=0)
    ax.add_patch(ellipse)

def generate_icon(name, icon_func, color, output_dir):
    """Generate single icon PNG"""
    fig = plt.figure(figsize=(ICON_SIZE/DPI, ICON_SIZE/DPI), dpi=DPI, facecolor='none')
    ax = fig.add_subplot(111)
    ax.set_xlim(0, ICON_SIZE)
    ax.set_ylim(0, ICON_SIZE)
    ax.set_aspect('equal')
    ax.axis('off')

    icon_func(ax, ICON_SIZE, color)

    output_path = os.path.join(output_dir, f'{name}.png')
    fig.savefig(output_path, format='png', dpi=DPI, transparent=True,
                bbox_inches='tight', pad_inches=0)
    plt.close(fig)
    print(f"✓ Generated {output_path}")

# Output directory
output_dir = '/Users/mac/zrby/pet-keeper-miniprogram/assets/tabbar'
os.makedirs(output_dir, exist_ok=True)

print("Generating individual TabBar icons for miniprogram...")
print(f"Output directory: {output_dir}")
print(f"Icon size: {ICON_SIZE}x{ICON_SIZE} pixels")
print()

# Generate all icons
icons = [
    ('home', create_leaf_icon),
    ('catalog', create_book_icon),
    ('community', create_community_icon),
    ('profile', create_profile_icon),
]

for name, icon_func in icons:
    # Normal state (gray)
    generate_icon(f'{name}-normal', icon_func, GRAY_NORMAL, output_dir)
    # Selected state (green)
    generate_icon(f'{name}-selected', icon_func, PRIMARY_GREEN, output_dir)

print()
print("✓ All TabBar icons generated successfully!")
print(f"  → {output_dir}/")
print("  → 8 icon files (4 icons × 2 states)")
print()
print("Icon files:")
for name, _ in icons:
    print(f"  - {name}-normal.png  (Gray #{GRAY_NORMAL})")
    print(f"  - {name}-selected.png (Green #{PRIMARY_GREEN})")