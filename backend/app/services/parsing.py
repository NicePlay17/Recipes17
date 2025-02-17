from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import time
import re
import random

class RecipeScraper:
    def __init__(self, chromedriver_path, base_url, links_file, output_file):
        """Инициализация параметров для парсинга."""
        self.chromedriver_path = chromedriver_path
        self.base_url = base_url
        self.links_file = links_file
        self.output_file = output_file
        
        # Настройки браузера
        self.chrome_options = Options()
        self.chrome_options.add_argument("--no-sandbox")
        self.chrome_options.add_argument("--disable-dev-shm-usage")
        self.chrome_options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
        
        self.service = Service(self.chromedriver_path)
        self.driver = webdriver.Chrome(service=self.service, options=self.chrome_options)

    def extract_links(self, text):
        """Извлекает все ссылки из строки."""
        urls = re.findall(r'https?://[^\s]+', text)
        return urls

    def extract_ingredients(self):
        """Извлекает все доступные продукты с текущей страницы рецепта."""
        ingredients = []
        try:
            # Начинаем с 2 индекса (первая строка с продуктами)
            i = 2
            while True:
                xpath = f"//*[@id='from']/tbody/tr/td[1]/table/tbody/tr[{i}]/td/span"
                try:
                    # Пробуем найти элемент по текущему XPath
                    ingredient_elements = self.driver.find_elements(By.XPATH, xpath)

                    # Если элемент найден, добавляем его текст в список
                    for ingredient in ingredient_elements:
                        ingredient_text = ingredient.text.strip()
                        if ingredient_text:
                            ingredients.append(ingredient_text)

                    # Если не нашли элемент, выходим из цикла
                    if not ingredient_elements:
                        break
                except Exception as e:
                    print(f"Ошибка при извлечении ингредиентов для XPath {xpath}: {e}")
                    break

                i += 1
        except Exception as e:
            print(f"Ошибка при извлечении ингредиентов: {e}")

        return ingredients

    def scrape_recipe_links(self):
        """Извлекает все ссылки на рецепты с главной страницы."""
        page = 1
        recipe_data = {}  # Словарь для хранения рецептов (ключ: ссылка, значение: название)

        while page<=1:  
            current_url = f"{self.base_url}&page={page}#rcp_list"
            self.driver.get(current_url)
            time.sleep(random.randint(10, 40)/random.randint(5, 10))  # Даем больше времени на загрузку страницы

            # Найдем все ссылки на рецепты
            recipes = self.driver.find_elements(By.XPATH, "//a[contains(@href, '/recipes/recipe.php?rid=')]")

            if not recipes:
                print(f"На странице {page} не найдено ссылок. Обработка завершена.")
                break

            # Обработка каждого рецепта
            for recipe in recipes:
                href = recipe.get_attribute("href")  # Получаем ссылку
                title = recipe.get_attribute("title")  # Извлекаем название через атрибут "title"

                # Проверяем, не был ли этот рецепт уже добавлен
                if href not in recipe_data:
                    recipe_data[href] = title
                    print(f"Добавлен рецепт: {title} - ({href})")

            print(f"Страница {page} обработана. Найдено рецептов: {len(recipes)}")
            page += 1

        # Записать ссылки и названия в файл
        with open(self.links_file, "w", encoding="utf-8") as file:
            for idx, (href, title) in enumerate(recipe_data.items(), start=1):
                file.write(f"{idx}. {title} - {href}\n")

        print(f"Сбор ссылок завершен! Всего рецептов: {len(recipe_data)}. Записано в файл {self.links_file}")

    def scrape_recipes(self):
        """Открывает ссылки и собирает данные о рецептах."""
        try:
            with open(self.links_file, "r", encoding="utf-8") as file:
                links = file.readlines()

            for idx, line in enumerate(links, start=1):
                line = line.strip()  # Убираем лишние пробелы и символы новой строки

                # Извлекаем ссылки из строки
                extracted_links = self.extract_links(line)

                # Если ссылка не найдена, пропускаем эту строку
                if not extracted_links:
                    print(f"Некорректная строка (ссылки не найдены): {line}")
                    continue

                link = extracted_links[0]
                print(f"Открываем ссылку {idx}: {link}")
                self.driver.get(link)
                time.sleep(3)  # Даем время на загрузку страницы

                try:
                    # Получаем название рецепта
                    title = self.driver.find_element(By.XPATH, "//*[@id='layout']/div/div/table[3]/tbody/tr[1]/td[2]/table/tbody/tr[2]/td/table/tbody/tr[2]/td/h1").text

                    # Извлекаем ингредиенты
                    ingredients = self.extract_ingredients()

                    # Записываем информацию в файл
                    with open(self.output_file, "a", encoding="utf-8") as output_file:
                        output_file.write(f"{idx}. {title}\n")
                        output_file.write("Ингредиенты:\n")
                        for ingredient in ingredients:
                            output_file.write(f"- {ingredient}\n")
                        output_file.write("\n")

                    print(f"Информация о рецепте {idx} успешно собрана и записана.")

                except Exception as e:
                    print(f"Ошибка при обработке ссылки {idx}: {e}")

            print(f"Сбор информации завершен. Данные сохранены в файл {self.output_file}.")
        
        finally:
            self.driver.quit()


if __name__ == "__main__":
    # Параметры и запуск
    scraper = RecipeScraper(
        chromedriver_path="D:/Web/chromedriver-win64/chromedriver.exe",
        base_url="https://www.russianfood.com/recipes/bytype/?fid=3&sort=id",
        links_file="../db/recipes_links_and_titles.txt",
        output_file="../db/topchik_utf8.txt"
    )
    
    # Сначала извлекаем все ссылки с главной страницы
    scraper.scrape_recipe_links()
    
    # Затем начинаем сбор данных о рецептах
    scraper.scrape_recipes()
