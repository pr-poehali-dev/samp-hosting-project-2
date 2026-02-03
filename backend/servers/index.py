import json
import os
import psycopg2
import random

def handler(event: dict, context) -> dict:
    '''API для управления серверами SAMP/CRMP и Telegram ботами'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            user_id = params.get('user_id')
            
            if not user_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'user_id обязателен'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("""
                SELECT id, name, type, plan, ip_address, port, status, mod, max_players, created_at
                FROM servers
                WHERE user_id = %s
                ORDER BY created_at DESC
            """, (user_id,))
            servers = cur.fetchall()
            
            cur.execute("""
                SELECT id, name, token, status, webhook_url, created_at
                FROM bots
                WHERE user_id = %s
                ORDER BY created_at DESC
            """, (user_id,))
            bots = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'servers': [
                        {
                            'id': s[0],
                            'name': s[1],
                            'type': s[2],
                            'plan': s[3],
                            'ip_address': s[4],
                            'port': s[5],
                            'status': s[6],
                            'mod': s[7],
                            'max_players': s[8],
                            'created_at': s[9].isoformat() if s[9] else None
                        }
                        for s in servers
                    ],
                    'bots': [
                        {
                            'id': b[0],
                            'name': b[1],
                            'token': b[2],
                            'status': b[3],
                            'webhook_url': b[4],
                            'created_at': b[5].isoformat() if b[5] else None
                        }
                        for b in bots
                    ]
                }),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'create_server':
                user_id = body.get('user_id')
                name = body.get('name')
                server_type = body.get('type', 'samp')
                plan = body.get('plan', 'free')
                mod = body.get('mod')
                
                if not user_id or not name:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'user_id и name обязательны'}),
                        'isBase64Encoded': False
                    }
                
                ip_address = f"185.{random.randint(1,254)}.{random.randint(1,254)}.{random.randint(1,254)}"
                port = random.randint(7777, 9999)
                
                cur.execute("""
                    INSERT INTO servers (user_id, name, type, plan, ip_address, port, status, mod)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING id, ip_address, port
                """, (user_id, name, server_type, plan, ip_address, port, 'installing', mod))
                
                server = cur.fetchone()
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'server': {
                            'id': server[0],
                            'ip_address': server[1],
                            'port': server[2]
                        }
                    }),
                    'isBase64Encoded': False
                }
            
            elif action == 'create_bot':
                user_id = body.get('user_id')
                name = body.get('name')
                token = body.get('token')
                
                if not user_id or not name or not token:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'user_id, name и token обязательны'}),
                        'isBase64Encoded': False
                    }
                
                webhook_url = f"https://bot-{random.randint(1000,9999)}.litehost.ru/webhook"
                
                cur.execute("""
                    INSERT INTO bots (user_id, name, token, status, webhook_url)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING id, webhook_url
                """, (user_id, name, token, 'stopped', webhook_url))
                
                bot = cur.fetchone()
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'bot': {
                            'id': bot[0],
                            'webhook_url': bot[1]
                        }
                    }),
                    'isBase64Encoded': False
                }
            
            elif action == 'control_server':
                server_id = body.get('server_id')
                command = body.get('command')
                
                if not server_id or not command:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'server_id и command обязательны'}),
                        'isBase64Encoded': False
                    }
                
                if command == 'start':
                    new_status = 'running'
                elif command == 'stop':
                    new_status = 'stopped'
                elif command == 'restart':
                    new_status = 'running'
                else:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Invalid command'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute(
                    "UPDATE servers SET status = %s WHERE id = %s RETURNING status",
                    (new_status, server_id)
                )
                result = cur.fetchone()
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'status': result[0] if result else None
                    }),
                    'isBase64Encoded': False
                }
            
            elif action == 'control_bot':
                bot_id = body.get('bot_id')
                command = body.get('command')
                
                if not bot_id or not command:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'bot_id и command обязательны'}),
                        'isBase64Encoded': False
                    }
                
                new_status = 'running' if command == 'start' else 'stopped'
                
                cur.execute(
                    "UPDATE bots SET status = %s WHERE id = %s RETURNING status",
                    (new_status, bot_id)
                )
                result = cur.fetchone()
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'status': result[0] if result else None
                    }),
                    'isBase64Encoded': False
                }
            
            else:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Invalid action'}),
                    'isBase64Encoded': False
                }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        cur.close()
        conn.close()
