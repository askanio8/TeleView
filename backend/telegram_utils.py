from telethon.sessions import StringSession
from telethon.sync import TelegramClient
import os
from dotenv import load_dotenv

load_dotenv()

def get_telegram_dialogs(session_string, api_id, api_hash):

    try:
        with TelegramClient(StringSession(session_string), api_id, api_hash) as client:
            dialogs = []
            for dialog in client.iter_dialogs():
                dialogs.append({
                    'id': dialog.id,
                    'title': dialog.title,
                    'unread_count': dialog.unread_count
                })
            return dialogs
    except Exception as e:
        print(f"Telegram dialog fetch error: {e}")
        return [
            {'id': 1, 'title': 'Fake Chat 1', 'unread_count': 5},
            {'id': 2, 'title': 'Fake Chat 2', 'unread_count': 0},
            {'id': 3, 'title': 'Fake Chat 3', 'unread_count': 3}
        ]


async def send_telegram_code(phone_number: str, api_id: int, api_hash: str):
    client = TelegramClient(StringSession(), api_id, api_hash)

    try:
        await client.connect()

        # Отправляем запрос на код и получаем phone_code_hash
        send_code_result = await client.send_code_request(phone_number)

        return {
            "success": True,
            "phone_code_hash": send_code_result.phone_code_hash
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
    finally:
        if client and client.is_connected():
            await client.disconnect()


async def verify_telegram_code_and_get_session(phone_number: str, code: str, phone_code_hash:str, api_id: int, api_hash: str) -> str:
    client = TelegramClient(StringSession(), api_id, api_hash)

    try:
        # Start the client
        await client.connect()

        # Sign in with the code
        await client.sign_in(phone_number, code, phone_code_hash=phone_code_hash)

        # Get the session string
        session_string = client.session.save()

        return session_string

    except Exception as e:
        print(f"Error during verification: {e}")
        return None

    finally:
        # Make sure to disconnect the client
        if client.is_connected():
            await client.disconnect()