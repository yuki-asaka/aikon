# build stage
FROM python:3.12-slim AS builder

ENV PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    POETRY_VIRTUALENVS_PATH=/opt/venv \
    DLIB_DEPS="cmake libboost-all-dev"

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libffi-dev libssl-dev && rm -rf /var/lib/apt/lists/*
RUN pip install --no-cache-dir poetry

COPY pyproject.toml ./
COPY poetry.lock ./

RUN poetry install --no-root

COPY . .

RUN VENV_DIR=$(ls /opt/venv) && \
    chmod -R a+rx /opt/venv/$VENV_DIR && \
    cp -a /opt/venv/$VENV_DIR /opt/venv/aikon-venv

# production stage
FROM python:3.12-slim

WORKDIR /app

ENV VIRTUAL_ENV=/opt/venv/aikon-venv \
    PATH="/opt/venv/aikon-venv/bin:$PATH" \
    NUMBA_DISABLE_CACHE=1 \
    NUMBA_CACHE_DIR=/tmp

COPY --from=builder /opt/venv/aikon-venv /opt/venv/aikon-venv
COPY --from=builder /app /app

RUN useradd -r -u 1000 appuser \
 && chown -R appuser:appuser /app \
 && chown -R appuser:appuser /opt/venv \
 && mkdir -p /home/appuser \
 && chown -R appuser:appuser /home/appuser

USER appuser

CMD ["python", "-m", "uvicorn", "app.main:app", "--worker", "2",  "--host", "0.0.0.0", "--port", "8000"]
