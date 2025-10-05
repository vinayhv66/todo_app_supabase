import React , {useState,useEffect} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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

async function updateTodo(id,newTitle){
  await supabase.from('todos').update({title:newTitle}).eq("id",id);
  fetchTodos();
}


async function deleteTodo(id){
  await supabase.from('todos').delete().eq("id",id);
  fetchTodos();
}



async function completeTodo(id){
  await supabase.from('todos').update({completed:true}).eq("id",id);
  fetchTodos();
}

  const incompleteCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  const itemVariants = {
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 6 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md">✓</span>
            <h1 className="text-lg font-semibold tracking-tight text-gray-900">Todo App</h1>
          </div>
          <div className="text-xs text-gray-600">
            <span className="mr-3">Open: <span className="font-semibold text-gray-900">{incompleteCount}</span></span>
            <span>Done: <span className="font-semibold text-gray-900">{completedCount}</span></span>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-2xl p-6">
        <h2 className="sr-only">Create a new todo</h2>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            className="flex-1 rounded-xl border border-gray-200 bg-white/90 px-3 py-2 text-sm placeholder:text-gray-400 shadow-md outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            placeholder='add new todo'
          />
          <button
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md transition hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50"
            onClick={addTodo}
          >
            Add Todo
          </button>
        </div>

        <h2 className="mt-10 text-xl font-semibold text-gray-900">Incomplete Todos</h2>
        <div className="mt-4 space-y-3">
          {incompleteCount === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white/80 p-6 text-center text-sm text-gray-500 shadow-sm backdrop-blur-sm">
              You're all caught up. Add a new task above!
            </div>
          ) : null}
          <AnimatePresence initial={false}>
            {todos.filter((t) => !t.completed).map((todo)=>(
              <motion.div
                key={todo.id}
                variants={itemVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="flex items-center justify-between rounded-xl border border-white/40 bg-white/70 p-3 shadow-md backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <span className="text-sm text-gray-900">{todo.title}</span>
                <div className="flex items-center gap-2">
                  <button
                    className="inline-flex items-center rounded-lg bg-green-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-md transition hover:bg-green-700"
                    onClick={()=>completeTodo(todo.id)}
                  >
                    Complete
                  </button>
                  <button
                    className="inline-flex items-center rounded-lg bg-amber-500 px-2.5 py-1.5 text-xs font-medium text-white shadow-md transition hover:bg-amber-600"
                    onClick={()=>
                      updateTodo(todo.id, prompt("new title:",todo.title))
                    }
                  >
                    Update
                  </button>
                  <button
                    className="inline-flex items-center rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-md transition hover:bg-red-700"
                    onClick={()=> deleteTodo(todo.id)}
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <h2 className="mt-10 text-xl font-semibold text-gray-900">Completed Todos</h2>
        <div className="mt-4 space-y-3">
          {completedCount === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white/80 p-6 text-center text-sm text-gray-500 shadow-sm backdrop-blur-sm">
              No completed tasks yet.
            </div>
          ) : null}
          <AnimatePresence initial={false}>
            {todos.filter((t) => t.completed).map((todo)=>(
              <motion.div
                key={todo.id}
                variants={itemVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="flex items-center justify-between rounded-xl border border-white/40 bg-white/70 p-3 shadow-md backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <span className="text-sm text-gray-500 line-through opacity-70">{todo.title}</span>
                <button
                  className="inline-flex items-center rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-md transition hover:bg-red-700"
                  onClick={()=> deleteTodo(todo.id)}
                >
                  Delete
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div> 
  )
  
}

export default App