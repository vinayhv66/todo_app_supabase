import React , {useState,useEffect} from 'react';
import supabase from './helper/supabaseClient'; 


function App() {

  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

useEffect(() => {
  fetchTodos();
}, []);

  async function fetchTodos(){
    const {data,error} = await supabase.from('todos').select("*").order("created_at",{ascending:true}  );

    if (error) console.log('error',error);
    else setTodos(data);
  }
  
  async function addTodo(){
    if(!title.trim()) return;
    const {error} = await supabase
    .from('todos').insert([{title,completed:false}]);
    if(error) console.log('error',error);
    else{
      setTitle("");
      fetchTodos();
    }
  }
async function completeTodo(id){
  await supabase.from('todos').update({completed:true}).eq("id",id);
  fetchTodos();
}

  return (
    <div >
      <h1>Todo App</h1>
      <input value={title} onChange={(e)=>setTitle(e.target.value)} 
      placeholder='add new todo'/>
      <button onClick={addTodo}>Add Todo</button>
      <h2>Incomplete Todos</h2>
      <div>  
      {todos.filter((t) => !t.completed).map((todo)=>(
        <div key={todo.id}>
      <span>{todo.title}</span> 
      <button onClick={()=>completeTodo(todo.id)}>Complete</button> 
      <button>Update</button>
      <button>Delete</button>
      </div>
      ))}
      </div>
      <h2>Completed Todos</h2>
      <div> 
      {todos.filter((t) => t.completed).map((todo)=>(
        <div key={todo.id}>
      <span>{todo.title}</span> 
      <button>Delete</button>
      </div>
      ))}
      </div>
    </div> 
  )
  
}
export default App