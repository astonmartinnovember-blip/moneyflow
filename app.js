const $=id=>document.getElementById(id);
let balance=450000, spent=0, pending=null;
const cats=['🍔 Тамақ','🚕 Такси','🛍️ Сауда','🎮 Ойын-сауық','📚 Оқу','🏠 Үй'];
function money(n){return n.toLocaleString('ru-RU')+' ₸'}
function render(){ $('balance').textContent=money(balance); $('spent').textContent=money(spent)+' төлем'; }
function openOperation(amount,type){pending={amount,type};$('operationText').textContent=`${money(amount)} ${type==='transfer'?'аударым':'төлем'} жасалды.`;$('cats').innerHTML=cats.map(c=>`<button data-cat="${c}">${c}</button>`).join('');$('overlay').classList.add('show');}
$('cats').addEventListener('click',e=>{if(!e.target.dataset.cat)return;const c=e.target.dataset.cat;const a=pending.amount;spent+=a;balance-=a;const d=document.createElement('div');d.className='item';d.innerHTML=`<span>${c}</span><b>−${money(a)}</b>`;$('list').querySelector('.muted')?.remove();$('list').prepend(d);$('overlay').classList.remove('show');render();pending=null;});
$('cancel').onclick=()=>{$('overlay').classList.remove('show');pending=null};
$('cardPay').onclick=()=>openOperation(8500,'payment');
$('transfer').onclick=()=>openOperation(20000,'transfer');
$('addForm').onsubmit=e=>{e.preventDefault();const a=parseInt($('amount').value.replace(/\D/g,''),10);if(!a)return;spent+=a;balance-=a;const d=document.createElement('div');d.className='item';d.innerHTML=`<span>${$('category').value}</span><b>−${money(a)}</b>`;$('list').querySelector('.muted')?.remove();$('list').prepend(d);$('amount').value='';render()};
$('reset').onclick=()=>{balance=450000;spent=0;$('list').innerHTML='<p class="muted">Әзірге шығын жоқ.</p>';render()};
$('notifyBtn').onclick=async()=>{if(!('Notification'in window)){alert('Бұл браузерде notification API жоқ.');return}const p=await Notification.requestPermission();alert(p==='granted'?'Хабарламалар қосылды.':'Хабарламаға рұқсат берілмеді.');};
render();