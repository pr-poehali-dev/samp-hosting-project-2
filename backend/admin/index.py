import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    '''API для админ-панели: управление балансом пользователей'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            cur.execute("""
                SELECT id, email, balance, is_admin, created_at 
                FROM users 
                ORDER BY created_at DESC
            """)
            users = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'users': [
                        {
                            'id': u[0],
                            'email': u[1],
                            'balance': float(u[2]),
                            'is_admin': u[3],
                            'created_at': u[4].isoformat() if u[4] else None
                        }
                        for u in users
                    ]
                }),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'update_balance':
                user_id = body.get('user_id')
                amount = body.get('amount')
                
                if not user_id or amount is None:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'user_id и amount обязательны'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute(
                    "UPDATE users SET balance = balance + %s WHERE id = %s RETURNING balance",
                    (amount, user_id)
                )
                new_balance = cur.fetchone()
                
                if new_balance:
                    cur.execute(
                        "INSERT INTO transactions (user_id, amount, type, description) VALUES (%s, %s, %s, %s)",
                        (user_id, amount, 'deposit' if amount > 0 else 'withdrawal', 'Начисление администратором')
                    )
                    conn.commit()
                    
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({
                            'success': True,
                            'new_balance': float(new_balance[0])
                        }),
                        'isBase64Encoded': False
                    }
                else:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Пользователь не найден'}),
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
