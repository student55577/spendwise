from turtle import pd
from unicodedata import category
from fastapi import FastAPI
import os
import uuid
from tinydb import TinyDB, Query
from pydantic import BaseModel
from tinydb.operations import delete
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from typing import List, Union

from fastapi import Depends, FastAPI, HTTPException, Security, status
from fastapi.security import (
    OAuth2PasswordBearer,
    OAuth2PasswordRequestForm,
    SecurityScopes,
)
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, ValidationError
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 600000
fake_users_db = {
    "johndoe": {
        "username": "jamesbond",
        "full_name": "James Bond",
        "email": "jamesbond@example.com",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
        "disabled": False,
    },
}

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Union[str, None] = None
    scopes: List[str] = []


class User(BaseModel):
    username: str
    email: Union[str, None] = None
    full_name: Union[str, None] = None
    disabled: Union[bool, None] = None


class UserInDB(User):
    hashed_password: str


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/token",
    scopes={"me": "Read information about the current user.", "items": "Read items."},
)

app = FastAPI()

def verify_password(plain_password, hashed_password):
    return True #pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return UserInDB(**user_dict)


def authenticate_user(fake_db, username: str, password: str):
    user = get_user(fake_db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(
    security_scopes: SecurityScopes, token: str = Depends(oauth2_scheme)
):
    if security_scopes.scopes:
        authenticate_value = f'Bearer scope="{security_scopes.scope_str}"'
    else:
        authenticate_value = f"Bearer"
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": authenticate_value},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_scopes = payload.get("scopes", [])
        token_data = TokenData(scopes=token_scopes, username=username)
    except (JWTError, ValidationError):
        raise credentials_exception
    user = get_user(fake_users_db, username=token_data.username)
    if user is None:
        raise credentials_exception
    # for scope in security_scopes.scopes:
    #     if scope not in token_data.scopes:
    #         raise HTTPException(
    #             status_code=status.HTTP_401_UNAUTHORIZED,
    #             detail="Not enough permissions",
    #             headers={"WWW-Authenticate": authenticate_value},
    #         )
    return user


async def get_current_active_user(
    current_user: User = Security(get_current_user, scopes=["me"])
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


@app.post("/api/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    print(form_data)
    user = authenticate_user(fake_users_db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "scopes": form_data.scopes},
        expires_delta=access_token_expires,
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/api/users/me/", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user


@app.get("/api/users/me/items/")
async def read_own_items(
    current_user: User = Security(get_current_active_user, scopes=["items"])
):
    return [{"item_id": "Foo", "owner": current_user.username}]


@app.get("/status/")
async def read_system_status(current_user: User = Depends(get_current_user)):
    return {"status": "ok"}
db_path = os.path.join( os.getcwd() , "..", "db")

class TransactionInfo(BaseModel):
    amount: int
    category: str
    type: str
    date: str 

class TransactionID(BaseModel):
    id: str

class GoalInfo(BaseModel):
    amount: int
    goal: str
    duration: str
    inflation: int
    date: str 

class GoalID(BaseModel):
    id: str

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/api")
async def read_item():
    return {"item_id": 1}


incomeColors = ['#0e9e3e', '#aba9b0', '#c1cf46', '#5b6c73', '#c2ab74', '#cfb41d', '#8a2149', 
'#d46a92'];
saveColors = ['#c95fa2', '#7568f6', '#6354f5', '#2e1ec7', '#74c27d', '#7568f6', '#6354f5', '#2e1ec7', '#2312bf'];
expenseColors = ['#aba9b0', '#3f5f6b', '#cf6e46', '#2312bf', '#779939', '#2613d1',
 '#137bd1', '#a6b4bf', '#0f1921', '#347d3c', '#74c27d', '##74c27d'];
majorCategoriesColors = ['#c2ab74', '#c2ab74', '#c2ab74', '#4c8f43', '#c2ab74', '#c2ab74', '#42c279',
 '#6f2c9e', '#8378e9'];

incomeCategories = [
  { "type": 'Salary', "amount": 0, "color": incomeColors[0] },
  { "type": 'Student Allowance', "amount": 0, "color": incomeColors[1] },
  { "type": 'Business Revenue', "amount": 0, "color": incomeColors[2] },
  { "type": 'Dividend', "amount": 0, "color": incomeColors[3] },
  { "type": 'Lottery', "amount": 0, "color": incomeColors[4] },
  { "type": 'Rental Income', "amount": 0, "color": incomeColors[5] },
  { "type": 'Gift Amount', "amount": 0, "color": incomeColors[6] },
  { "type": 'Other', "amount": 0, "color": incomeColors[7] },
]

expenseCategories = [
  { "type": 'Bills', "subCategory": "Needs", "amount": 0, "color": expenseColors[0] },
  { "type": 'Loan', "subCategory": "Needs", "amount": 0, "color": expenseColors[1] },
  { "type": 'House', "subCategory": "Needs", "amount": 0, "color": expenseColors[2] },
  { "type": 'Clothes', "subCategory": "Needs", "amount": 0, "color": expenseColors[3] },
  { "type": 'Food', "subCategory": "Needs", "amount": 0, "color": expenseColors[4] },
  { "type": 'Transport', "subCategory": "Needs", "amount": 0, "color": expenseColors[5] },
  { "type": 'Car', "subCategory": "Needs", "amount": 0, "color": expenseColors[6] },  
  { "type": 'Vacation', "subCategory": "Want", "amount": 0, "color": expenseColors[7] },
  { "type": 'Dining Out', "subCategory": "Want", "amount": 0, "color": expenseColors[8] },
  { "type": 'Entertainment', "subCategory": "Want", "amount": 0, "color": expenseColors[9] },
  { "type": 'Shopping', "subCategory": "Want", "amount": 0, "color": expenseColors[10] },
  { "type": 'Other', "subCategory": "Want", "amount": 0, "color": expenseColors[11] },
]

majorCategories = [
    {"type": 'Need', "amount":0, "color": majorCategoriesColors[0]},
{"type": 'Want', "amount":0, "color": majorCategoriesColors[1]},
{"type": 'Investment', "amount":0, "color": majorCategoriesColors[2]},
]
need_Want_category = {
    'Bills': "Needs",
    'Loan' : "Needs",
    'House': "Needs",
    'Clothes': "Needs",
    'Food': "Needs",
    'Transport': "Needs",
    'Car': "Needs",  
    'Vacation': "Want",
    'Dining Out' : "Want",
    'Entertainment': "Want",
    'Shopping': "Want", 
    'Other': "Want",
}


@app.get("/api/categories/incomeCategories")
async def income_categories(current_user: User = Depends(get_current_active_user)):
    return incomeCategories

@app.get("/api/categories/expenseCategories")
async def expense_categories(current_user: User = Depends(get_current_active_user)):
    return expenseCategories

@app.get("/api/categories/savingCategories")
async def saving_categories(current_user: User = Depends(get_current_active_user)):
    savingCategories = [
    { "type": 'Retirement Savings', "subCategory": "savings", "amount": 0, "color": saveColors[0] },
    { "type": 'Emergency Fund', "subCategory": "savings", "amount": 0, "color": saveColors[1] },
    { "type": 'Payroll Investment', "subCategory": "savings", "amount": 0, "color": saveColors[2] },
    { "type": 'FixedDeposits', "subCategory": "savings", "amount": 0, "color": saveColors[3] },
    { "type": 'Equities', "subCategory": "savings", "amount": 0, "color": saveColors[4] },  
    { "type": 'MutualFunds', "subCategory": "savings", "amount": 0, "color": saveColors[5] }, 
    { "type": 'Bonds', "subCategory": "savings", "amount": 0, "color": saveColors[6] }, 
    { "type": 'Other', "subCategory": "savings", "amount": 0, "color": saveColors[7] }, 
]
    db = TinyDB(os.path.join(db_path, 'transactionsgoals.json'))
    c = Query()
    goals = db.search(c.username == current_user.username)
    # goal_names = [{ "type": i.get('goal'), "subCategory": "savings", "amount": 0, "color": saveColors[4] } ]
    for i in goals:
        savingCategories.append({ "type": i.get('goal'), "subCategory": "savings", "amount": 0, "color": saveColors[4] })
    return savingCategories

@app.get("/api/categories/majorCategories")
async def major_categories(current_user: User = Depends(get_current_active_user)):
    return majorCategories

@app.get("/api/resetTransactions")
async def reset_transactions():
    import uuid
    transactions = [{ "amount": 500, "category": 'Salary', "type": 'Income', "date": '2022-06-16',
     "id": str(uuid.uuid4()) }, { "amount": 525, "category": 'Investments', "type": 'Income', "date": '2022-06-16',
      "id": str(uuid.uuid4()) }, { "amount": 500, "category": 'Salary', "type": 'Income', "date": '2022-07-10', 
      "id": str(uuid.uuid4()) }, { "amount": 123, "category": 'Car', "type": 'Expense', "date": '2022-07-16',
       "id": str(uuid.uuid4()) }, { "amount": 50, "category": 'Pets', "type": 'Expense', "date": '2022-07-10',
        "id": str(uuid.uuid4()) }, { "amount": 500, "category": 'Travel', "type": 'Expense', "date": '2022-07-10', 
        "id": str(uuid.uuid4()) }, { "amount": 50, "category": 'Investments', "type": 'Income', "date": '2022-07-07',
         "id": str(uuid.uuid4()) }, { "amount": 500, "category": 'Savings', "type": 'Income', "date": '2022-01-07', 
         "id": str(uuid.uuid4()) }, { "amount": 5, "category": 'Savings', "type": 'Income', "date": '2022-07-07',
          "id": str(uuid.uuid4()) },
          { "amount": 5, "category": 'Other', "type": 'Saving', "date": '2022-07-07',
          "id": str(uuid.uuid4()) },{ "amount": 500, "category": 'Equities', "type": 'Saving', "date": '2022-07-07',
          "id": str(uuid.uuid4()) },{ "amount": 500, "category": 'FixedDeposit', "type": 'Saving', "date": '2022-07-07',
          "id": str(uuid.uuid4()) },
          ]
          
    db = TinyDB(os.path.join(db_path, 'transactions.json'))
    db.drop_tables()
    [db.insert(i) for i in transactions]
    return transactions

@app.get("/api/ChartData")
async def chart_data(is_type: str, current_user: User = Depends(get_current_active_user)):
    
    if is_type == "Income":
        filtered_categories = incomeCategories
    elif is_type == "Expense":
        filtered_categories = expenseCategories

    db = TinyDB(os.path.join(db_path, 'transactions.json'))
    t = Query()
    transactions = db.search((t.type==is_type) & (t.username == current_user.username))
    print(transactions)
    total = 0
    for i in transactions:
        total += i.get("amount")
    from collections import defaultdict
    cat_wise_amount = defaultdict(int)
    for i in transactions:
        cat_wise_amount[i.get("category")] += i.get("amount")
    transactions_data = cat_wise_amount.items()
    filtered_amount = [amt for _, amt in transactions_data]
    filtered_colors = []
    for i, _ in transactions_data:
        for j in filtered_categories:
            if j["type"] == i:
                filtered_colors.append(j["color"])
    filtered_labels = [i for i, _ in transactions_data]
    
    chartData = {
        "datasets": [{
        "data": filtered_amount,
        "backgroundColor": filtered_colors,
        }],
        "labels": filtered_labels,
    }
    return {"chartData": chartData, "total": total, "transactions": transactions}


@app.get("/api/Transactions")
async def get_transactions(current_user: User = Depends(get_current_active_user)):
    db = TinyDB(os.path.join(db_path, 'transactions.json'))
    c = Query()
    # import pdb;pdb.set_trace();
    return db.search(c.username == current_user.username)[::-1]

@app.post("/api/addTransaction")
async def add_transaction(transaction: TransactionInfo, current_user: User = Depends(get_current_active_user)):
    db = TinyDB(os.path.join(db_path, 'transactions.json'))
    tx = transaction.dict()
    print("current_user", current_user)
    tx.update({"id": str(uuid.uuid4()), "username": current_user.username})
    db.insert(tx)
    c = Query()
    return db.search(c.username == current_user.username)[::-1]

@app.post("/api/deleteTransaction")
async def delete_transaction(transaction_id: TransactionID, current_user: User = Depends(get_current_active_user)):
    db = TinyDB(os.path.join(db_path, 'transactions.json'))
    c = Query()
    el = db.get((c.id == str(transaction_id.dict()["id"])) & ( c.username == current_user.username))
    db.remove(doc_ids=[el.doc_id])
    return db.search(c.username == current_user.username)[::-1]

@app.post("/api/strategy_503020")
async def strategy_503020(current_user: User = Depends(get_current_active_user)):
    db = TinyDB(os.path.join(db_path, 'transactions.json'))
    c = Query()
    income = db.search((c.type == "Income") & (c.username== current_user.username))
    expense = db.search((c.type == "Expense") & (c.username== current_user.username))
    saving = db.search((c.type == "Saving") &  (c.username== current_user.username))
    total_income = sum([i.get("amount") for i in income])
    total_expense = sum([i.get("amount") for i in expense])
    needs_limit = (total_income * 50) /100
    wants_limit = (total_income * 30) /100
    savings_limit = (total_income * 20) /100
    need_spends = []
    want_spends = []
    for i in expense:
        category_type = need_Want_category.get(i.get("category"), 'Want')
        if category_type == "Needs":
            print(i.get("amount"))
            need_spends.append(i.get("amount"))
        elif category_type == "Want":
            want_spends.append(i.get("amount"))
    need_spends = sum(need_spends)
    want_spends = sum(want_spends)
    
    saving_spends = sum([j.get("amount") for j in saving])
    limits = [needs_limit, wants_limit, savings_limit]
    actuals = [need_spends, want_spends, saving_spends]
    return {"limits": limits, "actuals": actuals}

def goal_tracker(current_user):
    transaction_db = TinyDB(os.path.join(db_path, 'transactions.json'))
    db = TinyDB(os.path.join(db_path, 'transactionsgoals.json'))
    c = Query()

    income_data = transaction_db.search((c.type == 'Income') & (c.username == current_user.username))
    expense_data = transaction_db.search((c.type == 'Expense') & (c.username == current_user.username))
    saving_data = transaction_db.search((c.type == 'Saving') & (c.username == current_user.username))
    total_income = sum([i['amount'] for i  in income_data])
    total_expense = sum([i['amount'] for i  in expense_data])
    total_saving = sum([i['amount'] for i  in saving_data])
    from collections import defaultdict
    category_wise_saving_done = defaultdict(int)
    for i  in saving_data:
        category_wise_saving_done[i['category']] += i["amount"]
    
    current_balance = total_income - (total_expense + total_saving)
    goals = db.search(c.username == current_user.username)[::-1]
    big_goal = float('-inf')
    big_goal_id = ''
    small_goal = float('inf')
    small_goal_id = ''
    for i in goals:
        if i.get("amount") >= big_goal:
            big_goal = i.get("amount")
            big_goal_id = i.get("id")
        if i.get("amount") <= small_goal:
            small_goal = i.get("amount")
            small_goal_id = i.get("id")
    biggest_goal = db.search((c.id == big_goal_id) & (c.username == current_user.username))
    smallest_goal = db.search((c.id == small_goal_id) & (c.username == current_user.username))
    if len(biggest_goal) > 0:
        big_goal = biggest_goal[0]
    else:
        big_goal = None
    if len(smallest_goal) > 0:
        small_goal = smallest_goal[0]
    else:
        small_goal = None
    for i in goals:
        goal_start_date = datetime.strptime(i.get("date"), '%Y-%m-%d')
        target_date = goal_start_date +  relativedelta(months=int(i.get('duration')))
        target_date  = datetime.strftime(target_date, '%Y-%m-%d')
        saved_now = category_wise_saving_done[i.get("goal")] or 0
        target_reached = True if saved_now >= i.get("amount") else False
        i.update({'savedTillNow': saved_now, 'date': target_date,
        'targetReached': target_reached })
    return {"currentBalance": current_balance, "totalIncome": total_income, "totalExpense":total_expense, "totalSaving": total_saving,
    'bigGoal': big_goal, 'smallGoal': small_goal, "goals": goals
    }
@app.post("/api/addGoal")
async def add_transaction(transaction: GoalInfo, current_user: User = Depends(get_current_active_user)):
    db = TinyDB(os.path.join(db_path, 'transactionsgoals.json'))
    tx = transaction.dict()
    print("current_user", current_user)
    tx.update({"id": str(uuid.uuid4()), "username": current_user.username})
    db.insert(tx)
    c = Query()
    goals_data = db.search(c.username == current_user.username)[::-1]
    goals_info = goal_tracker(current_user)
    goals_data = goals_info.pop("goals")
    return {'goals': goals_data, 'goalsInfo': goals_info}

@app.post("/api/deleteGoal")
async def delete_transaction(transaction_id: GoalID, current_user: User = Depends(get_current_active_user)):
    transaction_db = TinyDB(os.path.join(db_path, 'transactionsgoals.json'))
    db = TinyDB(os.path.join(db_path, 'transactions.json'))
    c = Query()
    
    el = transaction_db.get((c.id == str(transaction_id.dict()["id"])) & ( c.username == current_user.username))
    goal_category = el.get("goal")
    goals_data = transaction_db.search(c.username == current_user.username)[::-1]
    goals = db.search((c.category == goal_category) & ( c.username == current_user.username))
    for j in goals:
        db.remove(doc_ids=[j.doc_id])
    transaction_db.remove(doc_ids=[el.doc_id])
    goals_info = goal_tracker(current_user)
    goals_data = goals_info.pop("goals")
    return {'goals': goals_data, 'goalsInfo': goals_info}

@app.get("/api/goals")
async def get_transactions(current_user: User = Depends(get_current_active_user)):
    goals_info = goal_tracker(current_user)
    goals_data = goals_info.pop("goals")
    return {'goals': goals_data, 'goalsInfo': goals_info} 

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000)