const ADMIN_PASSWORD = "admin123";
const STORAGE_KEY = "neonAcademyCourses";
const SESSION_KEY = "neonAcademyAdmin";

const DEFAULT_COURSES = [
 {id:"agencia-local",title:"Curso Agência Local",category:"NEGÓCIOS",description:"Aprenda conceitos e estratégias para estruturar uma agência local.",features:["Conteúdo prático","Aulas organizadas","Acesso online"],button:"QUERO CONHECER",link:"https://pay.kiwify.com.br/RJigGyl",icon:"🚀",image:""},
 {id:"tdah-sem-misterios",title:"TDAH sem Mistérios: Guia Prático para Organizar sua Vida",category:"ORGANIZAÇÃO",description:"Um guia informativo e prático para organizar tarefas, rotina e estudos.",features:["Guia prático","Organização","Conteúdo online"],button:"QUERO CONHECER",link:"",icon:"🧠",image:""},
 {id:"emagrecimento-sem-misterios",title:"Emagrecimento sem Mistérios",category:"BEM-ESTAR",description:"Conteúdo educativo sobre hábitos, organização e informações relacionadas ao tema.",features:["Conteúdo educativo","Rotina","Acesso online"],button:"QUERO CONHECER",link:"https://pay.kiwify.com.br/luKzlby",icon:"📈",image:""}
];

const $ = id => document.getElementById(id);

function getCourses(){
  try{
    const data=JSON.parse(localStorage.getItem(STORAGE_KEY));
    if(Array.isArray(data)) return data;
  }catch(e){}
  localStorage.setItem(STORAGE_KEY,JSON.stringify(DEFAULT_COURSES));
  return [...DEFAULT_COURSES];
}
function saveCourses(courses){localStorage.setItem(STORAGE_KEY,JSON.stringify(courses));}
function uid(){return "course-"+Date.now()+"-"+Math.random().toString(36).slice(2,8)}
function toast(msg){const t=document.createElement("div");t.className="toast";t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),2300)}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}

function showApp(){
  $("loginBox").hidden=true;$("adminApp").hidden=false;renderList();
}
function renderList(){
  const list=$("courseList"), empty=$("emptyList"), courses=getCourses();
  $("totalBadge").textContent=courses.length; list.innerHTML=""; empty.style.display=courses.length?"none":"block";
  courses.forEach(c=>{
    const row=document.createElement("div");row.className="course-row";
    row.innerHTML=`<div class="emoji">${esc(c.icon||"📚")}</div><div class="course-info"><strong>${esc(c.title)}</strong><small>${esc(c.category||"CURSO")}${c.link?" • link configurado":" • sem link"}</small></div><div class="row-actions"><button class="mini" data-edit="${esc(c.id)}">Editar</button><button class="mini delete" data-delete="${esc(c.id)}">Excluir</button></div>`;
    list.appendChild(row);
  });
  list.querySelectorAll("[data-edit]").forEach(b=>b.onclick=()=>editCourse(b.dataset.edit));
  list.querySelectorAll("[data-delete]").forEach(b=>b.onclick=()=>deleteCourse(b.dataset.delete));
}
function resetForm(){
  $("courseForm").reset();$("courseId").value="";$("buttonText").value="QUERO CONHECER";
  $("formTitle").textContent="Adicionar curso";$("saveBtn").textContent="Adicionar curso";$("cancelBtn").hidden=true;
}
function editCourse(id){
  const c=getCourses().find(x=>x.id===id);if(!c)return;
  $("courseId").value=c.id;$("title").value=c.title||"";$("category").value=c.category||"";$("description").value=c.description||"";
  $("icon").value=c.icon||"📚";$("buttonText").value=c.button||"QUERO CONHECER";$("link").value=c.link||"";$("image").value=c.image||"";
  $("features").value=(c.features||[]).join("\n");
  $("formTitle").textContent="Editar curso";$("saveBtn").textContent="Salvar alterações";$("cancelBtn").hidden=false;
  window.scrollTo({top:0,behavior:"smooth"});
}
function deleteCourse(id){
  const c=getCourses().find(x=>x.id===id);if(!c)return;
  if(!confirm(`Excluir "${c.title}"?`))return;
  saveCourses(getCourses().filter(x=>x.id!==id));renderList();resetForm();toast("Curso excluído.");
}

$("loginForm").addEventListener("submit",e=>{
  e.preventDefault();
  if($("adminPassword").value===ADMIN_PASSWORD){sessionStorage.setItem(SESSION_KEY,"1");$("loginError").textContent="";showApp();}
  else $("loginError").textContent="Senha incorreta.";
});
$("logoutBtn").onclick=()=>{sessionStorage.removeItem(SESSION_KEY);location.reload()};
$("cancelBtn").onclick=resetForm;

$("courseForm").addEventListener("submit",e=>{
  e.preventDefault();
  const title=$("title").value.trim(), description=$("description").value.trim(), link=$("link").value.trim();
  if(!title||!description){toast("Preencha nome e descrição.");return}
  if(link && !/^https?:\/\//i.test(link)){toast("O link precisa começar com https:// ou http://");return}
  const course={
    id:$("courseId").value||uid(),title,category:$("category").value.trim()||"CURSO",
    description,icon:$("icon").value.trim()||"📚",button:$("buttonText").value.trim()||"QUERO CONHECER",
    link,image:$("image").value.trim(),features:$("features").value.split("\n").map(x=>x.trim()).filter(Boolean)
  };
  const courses=getCourses(), index=courses.findIndex(x=>x.id===course.id);
  if(index>=0){courses[index]=course;toast("Curso atualizado!")}else{courses.push(course);toast("Curso adicionado!")}
  saveCourses(courses);renderList();resetForm();
});

$("exportBtn").onclick=()=>{
  const blob=new Blob([JSON.stringify(getCourses(),null,2)],{type:"application/json"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="neon-academy-cursos.json";a.click();URL.revokeObjectURL(a.href);toast("Backup exportado.");
};
$("importFile").onchange=e=>{
  const file=e.target.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=()=>{
    try{
      const data=JSON.parse(reader.result);
      if(!Array.isArray(data)||data.some(c=>!c.title))throw new Error();
      saveCourses(data);renderList();toast("Cursos importados!");
    }catch(err){toast("JSON inválido.");}
    e.target.value="";
  };reader.readAsText(file);
};
$("resetBtn").onclick=()=>{
  if(confirm("Restaurar os 3 cursos padrão? Isso substituirá os cursos atuais.")){saveCourses(DEFAULT_COURSES);renderList();resetForm();toast("Cursos padrão restaurados.")}
};

if(sessionStorage.getItem(SESSION_KEY)==="1")showApp();
