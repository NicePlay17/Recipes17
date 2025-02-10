from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

# Импортируем Base и engine
from backend.app.db.models import Base, engine
from backend.app.db.models import Ingredient  # Добавляем модель ингредиентов

# Конфиг Alembic
config = context.config

# Настройка логов
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Теперь Alembic знает о таблицах
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Запуск миграций в оффлайн-режиме."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Запуск миграций в онлайн-режиме."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
