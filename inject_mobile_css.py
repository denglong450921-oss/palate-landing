import os
import re

css_index = """
        @media (max-width: 960px) {
            .hero h1 { font-size: 42px; }
            .split-card { padding: 80px 5%; }
            .reviews-grid { grid-template-columns: repeat(2, 1fr); }
            .manifesto-banner { flex-direction: column; text-align: center; padding: 80px 5%; }
            .manifesto-accent { display: none; }
        }
        @media (max-width: 720px) {
            .hero-banner { padding-top: 80px; }
            .hero h1 { font-size: 36px; }
            .hero p { font-size: 16px; }
            .stats-section { flex-direction: column; gap: 40px; padding: 60px 5%; }
            .stat-card { width: 100%; }
            .split-section { flex-direction: column; }
            .split-card { width: 100%; padding: 60px 5%; border-right: none; }
            .split-card:last-child { border-top: none; }
            .reviews-section { padding: 60px 5%; }
            .reviews-grid { grid-template-columns: 1fr; }
        }
"""

css_brands = """
        @media (max-width: 960px) {
            .inner-hero h1 { font-size: 36px; }
            .values-grid { grid-template-columns: repeat(2, 1fr); }
            .content-grid { grid-template-columns: repeat(2, 1fr); padding: 80px 5%; }
            .charity-section { flex-direction: column; padding: 80px 5%; }
            .charity-img, .charity-content { width: 100%; }
            .charity-img { height: 300px; }
        }
        @media (max-width: 720px) {
            .inner-hero { padding-top: 140px; padding-bottom: 60px; }
            .inner-hero h1 { font-size: 32px; }
            .values-section { padding: 60px 5%; }
            .values-grid { grid-template-columns: 1fr; gap: 40px; }
            .content-grid { grid-template-columns: 1fr; }
            .process-section { padding: 60px 5%; }
            .process-steps { flex-direction: column; gap: 40px; }
            .step-block { width: 100%; }
            .action-banner { padding: 60px 5%; }
        }
"""

css_gastronomy = """
        @media (max-width: 960px) {
            .inner-hero h1 { font-size: 36px; }
            .manifesto-section { flex-direction: column; padding: 80px 5%; }
            .manifesto-left, .manifesto-right { width: 100%; }
            .manifesto-left { border-left: none; border-bottom: 4px solid #E5BA73; padding-left: 0; padding-bottom: 25px; margin-bottom: 20px; }
        }
        @media (max-width: 720px) {
            .inner-hero { padding-top: 140px; padding-bottom: 60px; }
            .inner-hero h1 { font-size: 32px; }
            .solutions-section { padding: 60px 5%; }
            .solutions-grid { grid-template-columns: 1fr; gap: 30px; }
            .showcase-section { padding: 60px 5%; }
            .showcase-grid { grid-template-columns: 1fr; gap: 30px; }
        }
"""

css_inquiry = """
        @media (max-width: 960px) {
            .form-section-wrapper { flex-direction: column; }
            .form-sidebar, .form-content-area { width: 100%; }
            .form-sidebar { padding: 60px 5%; }
            .form-content-area { padding: 60px 5%; }
        }
        @media (max-width: 720px) {
            .page-banner { padding-top: 120px; padding-bottom: 60px; margin-top: 60px; }
            .page-banner-text h1 { font-size: 32px; }
            .faq-section { padding: 60px 5%; }
            .faq-grid { grid-template-columns: 1fr; }
            .radio-group { flex-direction: column; gap: 15px; }
        }
"""

files_to_update = {
    'index.html': css_index,
    'brands.html': css_brands,
    'gastronomy.html': css_gastronomy,
    'inquiry.html': css_inquiry
}

for filename, css_append in files_to_update.items():
    filepath = f"/Users/f/Documents/github项目2026/web_fg_version1/{filename}"
    if not os.path.exists(filepath):
        continue
        
    with open(filepath, 'r') as f:
        content = f.read()
        
    # Check if we already injected mobile queries to avoid duplication
    if "@media (max-width: 720px)" not in content:
        # Insert before </style>
        content = content.replace("</style>", f"{css_append}    </style>")
        
        with open(filepath, 'w') as f:
            f.write(content)
            
print("Mobile adaptation CSS injected successfully.")
