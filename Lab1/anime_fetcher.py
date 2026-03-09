#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Anime Data Fetcher using AnimeParsers library
Получение данных о сериях и озвучках для KodikPlayer
Используем ShikimoriParser - не требует API ключей
"""

import json
import sys
from anime_parsers_ru import ShikimoriParser, KodikParser

def get_anime_info(shikimori_id):
    """
    Получить информацию об аниме по Shikimori ID
    """
    try:
        print(f"DEBUG: Creating ShikimoriParser for {shikimori_id}", file=sys.stderr)
        parser = ShikimoriParser()

        print(f"DEBUG: Calling parser.anime_info", file=sys.stderr)
        info = parser.anime_info(f"https://shikimori.one/animes/{shikimori_id}")

        print(f"DEBUG: Got info: {info}", file=sys.stderr)
        return {
            "success": True,
            "title": info.get("title", ""),
            "episodes": info.get("episodes", ""),
            "status": info.get("status", ""),
            "type": info.get("type", ""),
            "description": info.get("description", ""),
            "genres": info.get("genres", []),
            "studio": info.get("studio", ""),
            "score": info.get("score", ""),
            "picture": info.get("picture", "")
        }

    except Exception as e:
        print(f"DEBUG: Exception in get_anime_info: {e}", file=sys.stderr)
        return {
            "success": False,
            "error": str(e)
        }

def search_anime(title):
    """
    Поиск аниме по названию через ShikimoriParser
    """
    try:
        print(f"DEBUG: Starting search for: {title}")

        # Временное решение - возвращаем тестовые данные
        # TODO: Исправить работу с ShikimoriParser
        test_results = [
            {
                "title": "Naruto",
                "shikimori_id": "20",
                "type": "TV Сериал",
                "year": "2002",
                "status": "вышло",
                "studio": "Studio Pierrot",
                "link": "https://shikimori.one/animes/z20-naruto"
            },
            {
                "title": "Naruto: Shippuuden",
                "shikimori_id": "1735",
                "type": "TV Сериал",
                "year": "2007",
                "status": "вышло",
                "studio": "Studio Pierrot",
                "link": "https://shikimori.one/animes/z1735-naruto-shippuuden"
            },
            {
                "title": "Boruto: Naruto Next Generations",
                "shikimori_id": "34566",
                "type": "TV Сериал",
                "year": "2017",
                "status": "вышло",
                "studio": "Studio Pierrot",
                "link": "https://shikimori.one/animes/z34566-boruto-naruto-next-generations"
            }
        ]

        # Фильтруем по названию
        filtered_results = [r for r in test_results if title.lower() in r["title"].lower()]

        print(f"DEBUG: Returning {len(filtered_results)} results", file=sys.stderr)
        return {
            "success": True,
            "results": filtered_results[:5]
        }

    except Exception as e:
        print(f"DEBUG: Exception in search_anime: {e}", file=sys.stderr)
        return {
            "success": False,
            "error": str(e)
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

def get_anime_list(limit=10):
    """
    Получить список популярных аниме
    """
    try:
        parser = ShikimoriParser()

        # Получаем список аниме с сортировкой по рейтингу
        results = parser.get_anime_list(
            sort_by="rating",
            page_limit=1,
            start_page=1
        )

        formatted_results = []
        for result in results[:limit]:
            formatted_results.append({
                "title": result.get("title", ""),
                "shikimori_id": result.get("shikimori_id"),
                "type": result.get("type", ""),
                "year": result.get("year", ""),
                "url": result.get("url", "")
            })

        return {
            "success": True,
            "results": formatted_results
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

def get_kodik_links(shikimori_id, episode=None, translation=None):
    """
    Получить прямые ссылки Kodik для просмотра
    Пока что возвращаем пример iframe для тестирования
    """
    try:
        # Пример iframe ссылки (нужно заменить на реальную логику получения)
        example_url = "https://kodik.info/seria/1559388/e8959bba34e9039208c3a755ddf3e3d0/720p"

        # Для тестирования возвращаем пример
        links = [{
            "episode": episode or "1",
            "translation": translation or "anilibria",
            "quality": "720p",
            "url": example_url,
            "iframe": f'<iframe src="{example_url}" width="607" height="360" frameborder="0" allowfullscreen allow="autoplay *; fullscreen *"></iframe>'
        }]

        return {
            "success": True,
            "links": links,
            "total": len(links),
            "note": "Это тестовые данные. Реальная интеграция требует Kodik API токена."
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Не указан параметр действия"}))
        sys.exit(1)

    action = sys.argv[1]

    if action == "info" and len(sys.argv) >= 3:
        shikimori_id = sys.argv[2]
        result = get_anime_info(shikimori_id)
        print(json.dumps(result, ensure_ascii=False))

    elif action == "search" and len(sys.argv) >= 3:
        title = sys.argv[2]
        result = search_anime(title)
        print(json.dumps(result, ensure_ascii=False))
        sys.exit(0)

    elif action == "list":
        limit = int(sys.argv[2]) if len(sys.argv) >= 3 else 10
        result = get_anime_list(limit)
        print(json.dumps(result, ensure_ascii=False))

    elif action == "kodik" and len(sys.argv) >= 3:
        print("DEBUG: Starting kodik action", file=sys.stderr)
        shikimori_id = sys.argv[2]
        episode = sys.argv[3] if len(sys.argv) >= 4 else None
        translation = sys.argv[4] if len(sys.argv) >= 5 else None
        print(f"DEBUG: Params - id:{shikimori_id}, episode:{episode}, translation:{translation}", file=sys.stderr)
        result = get_kodik_links(shikimori_id, episode, translation)
        print(f"DEBUG: Result: {result}", file=sys.stderr)
        output = json.dumps(result, ensure_ascii=False)
        print(f"DEBUG: JSON output: {output}", file=sys.stderr)
        print(output)
        sys.exit(0)

    else:
        print(json.dumps({"error": "Неверные параметры"}))
        sys.exit(1)