"""The site map (docs/map.md), made from the nav of mkdocs.yml: each section, and each page with the first sentence of
its introduction. Run again when the nav changes:  npm run map  (in docs/)."""
import os
import re
import yaml

DOCS = os.path.join(os.path.dirname(__file__), '..', '..')
PAGES = os.path.join(DOCS, 'docs')


class Loader(yaml.SafeLoader):
    """mkdocs.yml's own tags (!!python/name, !ENV) are not needed here: read as nothing."""


Loader.add_multi_constructor('', lambda loader, suffix, node: None)


def plain(text):
    text = re.sub(r'!\[[^\]]*\]\([^)]*\)', '', text)                 # images
    text = re.sub(r'\[\]\([^)]*\)', '', text)                        # a link that was only an image (a badge)
    text = re.sub(r'\[([^\]]+)\]\([^)]*\)', r'\1', text)             # links: their text
    text = re.sub(r'[*`]+', '', text)
    return ' '.join(text.split())


def summary(page):
    """The first sentence of the page's first paragraph after its title; '' when it has none."""
    path = os.path.join(PAGES, page)
    if not os.path.exists(path):
        return None
    lines, fence = [], False
    for line in open(path, encoding='utf8'):
        stripped = line.strip()
        if stripped.startswith('```'):
            fence = not fence
            if lines:
                break
            continue
        if fence or stripped.startswith(('#', '<', '|', '!', '---', '>', '-', '*', '1.')) and not lines:
            continue
        if re.fullmatch(r'=+|-{3,}', stripped):     # the line above was a heading, underlined
            lines = []
            continue
        if not stripped:
            if lines:
                break
            continue
        lines.append(stripped)
    text = plain(' '.join(lines))
    sentence = re.match(r'(.+?[.!?])(\s|$)', text)
    text = sentence.group(1) if sentence else text
    return text if len(text) <= 180 else text[:177].rsplit(' ', 1)[0] + '…'


def main():
    nav = yaml.load(open(os.path.join(DOCS, 'mkdocs.yml'), encoding='utf8'), Loader=Loader)['nav']
    out = ['# Site map', '', 'Every page of these docs, as the menu has them. Generated from `mkdocs.yml` by `npm run map`.', '']
    for section in nav:
        (name, pages), = section.items()
        out += [f'## {name}', '']
        for entry in pages if isinstance(pages, list) else [{name: pages}]:
            (title, page), = entry.items()
            if page == 'map.md':
                continue
            about = summary(page)
            if about is None:           # in the nav, not in the docs
                continue
            out.append(f'- [{title}]({page})' + (f': {about}' if about else ''))
        out.append('')
    open(os.path.join(PAGES, 'map.md'), 'w', encoding='utf8', newline='\n').write('\n'.join(out))


main()
