import { useState, useEffect } from "react";

const KEYS = {
  checklist: "jb-checklist-v1",
  customItems: "jb-custom-items-v1",
  calendar: "jb-calendar-v1",
  notes: "jb-notes-v1",
};

const DEFAULT_ITEMS = [
  { id: 1, text: "Go on a phone-free date and be fully present" },
  { id: 2, text: "Plan a weekend getaway to a place you've never been" },
  { id: 3, text: "Create a shared bucket list for the next 5 years" },
  { id: 4, text: "Take a cooking class (or cook a full themed dinner at home)" },
  { id: 5, text: "Watch the sunrise together at least once" },
  { id: 6, text: "Start a new tradition just for the two of you" },
  { id: 7, text: "Do a couple photoshoot (professional or DIY)" },
  { id: 8, text: "Train for something together (gym challenge, run, hike)" },
  { id: 9, text: "Have a deep life-goals talk over wine or coffee" },
  { id: 10, text: "Go on a spontaneous day trip with no plan" },
  { id: 11, text: "Recreate your first date" },
  { id: 12, text: "Learn a new skill together (dance, language, pottery)" },
  { id: 13, text: "Write each other a letter to open in one year" },
  { id: 14, text: "Have a no-spend date and get creative" },
  { id: 15, text: "Do a digital detox weekend" },
  { id: 16, text: "Volunteer together for a cause you care about" },
  { id: 17, text: "Take a road trip and make a shared playlist" },
  { id: 18, text: "Try something slightly out of your comfort zone together" },
  { id: 19, text: "Have a home spa night" },
  { id: 20, text: "Go stargazing or watch a meteor shower" },
  { id: 21, text: "Plan a dream trip even if you can't take it yet" },
  { id: 22, text: "Do a vision board for your future together" },
  { id: 23, text: "Start a shared journal or memory book" },
  { id: 24, text: "Go on a double date with another couple you admire" },
  { id: 25, text: "Attend an event or concert together" },
  { id: 26, text: "Have a game night just the two of you" },
  { id: 27, text: "Cook each other's favorite childhood meal" },
  { id: 28, text: "Do a gratitude ritual (weekly or monthly)" },
  { id: 29, text: "Take a class or workshop focused on growth or mindset" },
  { id: 30, text: "End the year with a reflection date and celebrate how far you've come" },
];

const NOTE_COLORS = [
  { bg: "#fff9c4", border: "#f0e060" },
  { bg: "#fce4ec", border: "#f48fb1" },
  { bg: "#e8f5e9", border: "#a5d6a7" },
  { bg: "#e3f2fd", border: "#90caf9" },
  { bg: "#f3e5f5", border: "#ce93d8" },
  { bg: "#fff3e0", border: "#ffcc80" },
];

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function daysUntil(dateStr) {
  const today = new Date(); today.setHours(0,0,0,0);
  const target = new Date(dateStr); target.setHours(0,0,0,0);
  return Math.round((target - today) / 86400000);
}
function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" });
}
function monthDays(year, month) { return new Date(year, month + 1, 0).getDate(); }
function firstDayOfMonth(year, month) { return new Date(year, month, 1).getDay(); }

function lget(key) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; }
}
function lset(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
:root{--rose:#c4756a;--rose-d:#a05248;--rose-p:#fceae7;--cream:#fdf8f4;--ink:#2c1f1c;--ink-s:#7a5550;--border:#edddd8;}
html,body,#root{height:100%;background:var(--cream);}
body{font-family:'DM Sans',sans-serif;}
.app{max-width:680px;margin:0 auto;min-height:100vh;}
.hdr{background:linear-gradient(150deg,#b8574c 0%,#d4877c 100%);padding:36px 24px 28px;text-align:center;position:relative;overflow:hidden;}
.hdr::before{content:'';position:absolute;top:-50px;right:-50px;width:180px;height:180px;border-radius:50%;background:rgba(255,255,255,.07);}
.hdr::after{content:'';position:absolute;bottom:-70px;left:-30px;width:200px;height:200px;border-radius:50%;background:rgba(255,255,255,.05);}
.hdr-title{font-family:'Cormorant Garamond',serif;font-size:40px;color:#fff;letter-spacing:.03em;position:relative;z-index:1;line-height:1;}
.hdr-title em{font-style:italic;opacity:.8;font-size:30px;}
.hdr-sub{color:rgba(255,255,255,.65);font-size:12px;letter-spacing:.14em;text-transform:uppercase;margin-top:7px;position:relative;z-index:1;}
.tabs{display:flex;background:#fff;border-bottom:1.5px solid var(--border);position:sticky;top:0;z-index:20;}
.tab{flex:1;height:52px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-s);cursor:pointer;border:none;border-bottom:2.5px solid transparent;background:none;font-family:'DM Sans',sans-serif;font-weight:500;transition:all .2s;}
.tab .ti{font-size:18px;}
.tab.active{color:var(--rose-d);border-bottom-color:var(--rose-d);}
.section{padding:16px 14px 80px;}
.prog-wrap{padding:16px 16px 0;}
.prog-lbl{display:flex;justify-content:space-between;font-size:12px;color:var(--ink-s);margin-bottom:6px;}
.prog-track{background:var(--border);border-radius:10px;height:7px;overflow:hidden;}
.prog-fill{height:100%;background:linear-gradient(90deg,var(--rose),var(--rose-d));border-radius:10px;transition:width .5s cubic-bezier(.4,0,.2,1);}
.cl-list{display:flex;flex-direction:column;gap:8px;margin-top:14px;}
.cl-item{display:flex;align-items:flex-start;gap:12px;padding:12px 14px;border-radius:13px;cursor:pointer;border:1.5px solid var(--border);background:#fff;transition:all .2s;user-select:none;}
.cl-item.done{background:var(--rose-p);border-color:#d9aba4;}
.cl-item:active{transform:scale(.975);}
.cl-num{min-width:27px;height:27px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;flex-shrink:0;margin-top:1px;transition:all .2s;background:var(--rose-p);color:var(--rose-d);}
.cl-item.done .cl-num{background:var(--rose);color:#fff;}
.cl-txt{font-size:14px;line-height:1.55;color:var(--ink);flex:1;transition:all .2s;}
.cl-item.done .cl-txt{text-decoration:line-through;color:var(--ink-s);text-decoration-color:var(--rose);}
.cl-heart{font-size:14px;flex-shrink:0;margin-top:2px;opacity:0;transition:opacity .2s;}
.cl-item.done .cl-heart{opacity:1;}
.add-item-row{display:flex;gap:8px;margin-top:10px;}
.add-item-input{flex:1;border:1.5px solid var(--border);border-radius:10px;padding:10px 12px;font-family:'DM Sans',sans-serif;font-size:14px;color:var(--ink);outline:none;background:#fff;transition:border-color .18s;}
.add-item-input:focus{border-color:var(--rose);}
.add-item-btn{padding:10px 16px;border-radius:10px;background:var(--rose);color:#fff;border:none;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;cursor:pointer;white-space:nowrap;}
.add-item-btn:disabled{opacity:.4;}
.cal-nav{display:flex;align-items:center;justify-content:space-between;padding:10px 4px;}
.cal-nav-btn{background:none;border:none;color:var(--rose-d);font-size:24px;cursor:pointer;padding:4px 12px;border-radius:8px;}
.cal-month{font-family:'Cormorant Garamond',serif;font-size:22px;color:var(--ink);font-weight:600;}
.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;}
.cal-dow{text-align:center;font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-s);padding-bottom:5px;font-weight:500;}
.cal-day{aspect-ratio:1;display:flex;align-items:center;justify-content:center;border-radius:50%;font-size:13px;cursor:pointer;position:relative;transition:all .18s;color:var(--ink);}
.cal-day.today{background:var(--rose-p);color:var(--rose-d);font-weight:600;}
.cal-day.has-event::after{content:'♥';position:absolute;bottom:0px;right:1px;font-size:7px;color:var(--rose);}
.cal-day:not(:empty):hover{background:var(--rose-p);}
.cal-day.selected{background:var(--rose)!important;color:#fff!important;}
.cal-events{margin-top:18px;display:flex;flex-direction:column;gap:9px;}
.cal-events-title{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-s);font-weight:500;margin-bottom:2px;}
.cal-event-card{background:#fff;border:1.5px solid var(--border);border-radius:13px;padding:12px 14px;display:flex;align-items:center;gap:10px;}
.cal-event-info{flex:1;}
.cal-event-date{font-size:11px;font-weight:600;color:var(--rose-d);letter-spacing:.04em;}
.cal-event-name{font-size:14px;color:var(--ink);line-height:1.4;margin-top:2px;}
.cal-event-countdown{font-size:11px;background:var(--rose-p);color:var(--rose-d);border-radius:20px;padding:3px 10px;white-space:nowrap;font-weight:500;}
.cal-event-del{background:none;border:none;color:#ccc;font-size:18px;cursor:pointer;padding:0 2px;line-height:1;transition:color .15s;}
.cal-event-del:hover{color:var(--rose);}
.modal-overlay{position:fixed;inset:0;background:rgba(44,31,28,.4);z-index:100;display:flex;align-items:flex-end;justify-content:center;}
.modal{background:#fff;border-radius:20px 20px 0 0;padding:24px 20px 40px;width:100%;max-width:680px;animation:slideUp .25s ease;}
@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
.modal-title{font-family:'Cormorant Garamond',serif;font-size:22px;color:var(--ink);margin-bottom:14px;font-weight:600;}
.modal-input{width:100%;border:1.5px solid var(--border);border-radius:10px;padding:11px 13px;font-family:'DM Sans',sans-serif;font-size:15px;color:var(--ink);outline:none;background:var(--cream);transition:border-color .18s;margin-bottom:12px;}
.modal-input:focus{border-color:var(--rose);}
.modal-btns{display:flex;gap:8px;}
.modal-save{flex:1;padding:12px;border-radius:10px;background:linear-gradient(135deg,var(--rose),var(--rose-d));color:#fff;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;border:none;cursor:pointer;}
.modal-save:disabled{opacity:.4;}
.modal-cancel{padding:12px 18px;border-radius:10px;background:var(--rose-p);color:var(--rose-d);font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;border:none;cursor:pointer;}
.notes-grid{columns:2;gap:10px;}
.note-card{break-inside:avoid;border-radius:12px;padding:14px;margin-bottom:10px;border:1.5px solid;position:relative;box-shadow:2px 3px 10px rgba(0,0,0,.07);animation:fadeUp .3s ease;}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.note-who{font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--rose-d);margin-bottom:6px;}
.note-text{font-family:'Cormorant Garamond',serif;font-size:16px;line-height:1.6;color:var(--ink);word-break:break-word;}
.note-date{font-size:10px;color:#aaa;margin-top:8px;}
.note-del{position:absolute;top:7px;right:7px;background:none;border:none;color:rgba(0,0,0,.2);font-size:16px;cursor:pointer;line-height:1;transition:color .15s;}
.note-del:hover{color:var(--rose);}
.note-form{background:#fff;border:1.5px solid var(--border);border-radius:14px;padding:14px;margin-bottom:14px;}
.note-form-label{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--rose-d);font-weight:500;margin-bottom:9px;}
.note-who-row{display:flex;gap:6px;margin-bottom:9px;}
.who-btn{padding:6px 14px;border-radius:20px;border:1.5px solid var(--border);background:#fff;font-family:'DM Sans',sans-serif;font-size:12px;cursor:pointer;color:var(--ink-s);transition:all .18s;font-weight:500;}
.who-btn.sel{background:var(--rose);border-color:var(--rose);color:#fff;}
.color-row{display:flex;gap:8px;margin-bottom:9px;}
.color-dot{width:22px;height:22px;border-radius:50%;cursor:pointer;border:2.5px solid transparent;transition:transform .18s;}
.color-dot.sel{transform:scale(1.25);}
.note-ta{width:100%;border:1.5px solid var(--border);border-radius:10px;padding:10px 12px;font-family:'Cormorant Garamond',serif;font-size:16px;color:var(--ink);resize:none;min-height:80px;outline:none;transition:border-color .18s;line-height:1.55;}
.note-ta:focus{border-color:var(--rose);}
.note-submit{margin-top:9px;width:100%;padding:11px;border-radius:10px;background:linear-gradient(135deg,var(--rose),var(--rose-d));color:#fff;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;border:none;cursor:pointer;}
.note-submit:disabled{opacity:.4;}
.empty{text-align:center;padding:40px 24px;color:#c0a098;}
.empty-icon{font-size:32px;margin-bottom:10px;}
.empty-txt{font-family:'Cormorant Garamond',serif;font-size:18px;font-style:italic;}
.celebrate{background:linear-gradient(135deg,#f9d6c8,#fce8e0);border:1.5px solid #deb8b0;border-radius:13px;padding:14px 18px;text-align:center;margin-bottom:12px;font-family:'Cormorant Garamond',serif;font-size:17px;color:var(--rose-d);font-style:italic;}
`;

export default function App() {
  const [tab, setTab] = useState("list");
  const [checked, setChecked] = useState({});
  const [customItems, setCustomItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);
  const [dayInput, setDayInput] = useState("");
  const [calEvents, setCalEvents] = useState({});
  const [notes, setNotes] = useState([]);
  const [who, setWho] = useState("Jay");
  const [noteColor, setNoteColor] = useState(0);
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    setChecked(lget(KEYS.checklist) || {});
    setCustomItems(lget(KEYS.customItems) || []);
    setCalEvents(lget(KEYS.calendar) || {});
    setNotes(lget(KEYS.notes) || []);
  }, []);

  const toggleItem = (id) => {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next); lset(KEYS.checklist, next);
  };
  const addCustomItem = () => {
    if (!newItem.trim()) return;
    const allIds = [...DEFAULT_ITEMS, ...customItems].map(i => i.id);
    const maxId = Math.max(...allIds, 30);
    const item = { id: maxId + 1, text: newItem.trim() };
    const next = [...customItems, item];
    setCustomItems(next); setNewItem(""); lset(KEYS.customItems, next);
  };

  const allItems = [...DEFAULT_ITEMS, ...customItems];
  const done = allItems.filter(i => checked[i.id]).length;
  const pct = Math.round((done / allItems.length) * 100);

  const calKey = (y, m, d) => `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  const saveDay = () => {
    if (!dayInput.trim() || selectedDay === null) return;
    const key = calKey(calYear, calMonth, selectedDay);
    const next = { ...calEvents, [key]: dayInput.trim() };
    setCalEvents(next); setSelectedDay(null); setDayInput(""); lset(KEYS.calendar, next);
  };
  const delCalEvent = (key) => {
    const next = { ...calEvents }; delete next[key];
    setCalEvents(next); lset(KEYS.calendar, next);
  };

  const todayKey = calKey(today.getFullYear(), today.getMonth(), today.getDate());
  const firstDay = firstDayOfMonth(calYear, calMonth);
  const totalDays = monthDays(calYear, calMonth);
  const sortedEvents = Object.entries(calEvents)
    .map(([k, v]) => ({ key: k, label: v, days: daysUntil(k) }))
    .sort((a, b) => a.days - b.days);

  const addNote = () => {
    if (!noteText.trim()) return;
    const note = { id: Date.now(), who, color: noteColor, text: noteText.trim(), date: new Date().toISOString() };
    const next = [note, ...notes];
    setNotes(next); setNoteText(""); lset(KEYS.notes, next);
  };
  const delNote = (id) => {
    const next = notes.filter(n => n.id !== id);
    setNotes(next); lset(KEYS.notes, next);
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <div className="hdr">
          <div className="hdr-title">Jay <em>&amp;</em> Best</div>
          <div className="hdr-sub">our little world ♥</div>
        </div>

        <div className="tabs">
          {[{id:"list",icon:"☑",label:"Our List"},{id:"calendar",icon:"📅",label:"Calendar"},{id:"notes",icon:"🌸",label:"Notes"}].map(t=>(
            <button key={t.id} className={`tab ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)}>
              <span className="ti">{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        {tab==="list" && (
          <>
            <div className="prog-wrap">
              <div className="prog-lbl"><span>{done} of {allItems.length} done</span><span>{pct}%</span></div>
              <div className="prog-track"><div className="prog-fill" style={{width:`${pct}%`}}/></div>
            </div>
            <div className="section">
              {done===allItems.length && allItems.length>0 && (
                <div className="celebrate">🎉 You've done everything! What an adventure together. ♥</div>
              )}
              <div className="cl-list">
                {allItems.map(item=>{
                  const isDone=!!checked[item.id];
                  return (
                    <div key={item.id} className={`cl-item ${isDone?"done":""}`} onClick={()=>toggleItem(item.id)}>
                      <div className="cl-num">{isDone?"✓":item.id}</div>
                      <div className="cl-txt">{item.text}</div>
                      <div className="cl-heart">♥</div>
                    </div>
                  );
                })}
              </div>
              <div className="add-item-row">
                <input className="add-item-input" placeholder="Add your own activity…" value={newItem}
                  onChange={e=>setNewItem(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCustomItem()}/>
                <button className="add-item-btn" onClick={addCustomItem} disabled={!newItem.trim()}>+ Add</button>
              </div>
            </div>
          </>
        )}

        {tab==="calendar" && (
          <div className="section">
            <div className="cal-nav">
              <button className="cal-nav-btn" onClick={()=>{if(calMonth===0){setCalMonth(11);setCalYear(y=>y-1);}else setCalMonth(m=>m-1);}}>‹</button>
              <span className="cal-month">{MONTH_NAMES[calMonth]} {calYear}</span>
              <button className="cal-nav-btn" onClick={()=>{if(calMonth===11){setCalMonth(0);setCalYear(y=>y+1);}else setCalMonth(m=>m+1);}}>›</button>
            </div>
            <div className="cal-grid">
              {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d=><div key={d} className="cal-dow">{d}</div>)}
              {Array.from({length:firstDay}).map((_,i)=><div key={`e${i}`}/>)}
              {Array.from({length:totalDays}).map((_,i)=>{
                const d=i+1;
                const key=calKey(calYear,calMonth,d);
                const isToday=key===todayKey;
                const hasDot=!!calEvents[key];
                const isSel=selectedDay===d;
                return (
                  <div key={d} className={`cal-day${isToday?" today":""}${hasDot?" has-event":""}${isSel?" selected":""}`}
                    onClick={()=>{setSelectedDay(d);setDayInput(calEvents[calKey(calYear,calMonth,d)]||"");}}>
                    {d}
                  </div>
                );
              })}
            </div>
            {sortedEvents.length>0 && (
              <div className="cal-events">
                <div className="cal-events-title">Saved Dates</div>
                {sortedEvents.map(ev=>{
                  const label=ev.days<0?`${Math.abs(ev.days)}d ago`:ev.days===0?"Today! 🎉":`${ev.days}d away`;
                  return (
                    <div key={ev.key} className="cal-event-card">
                      <div className="cal-event-info">
                        <div className="cal-event-date">{formatDate(ev.key)}</div>
                        <div className="cal-event-name">{ev.label}</div>
                      </div>
                      <div className="cal-event-countdown">{label}</div>
                      <button className="cal-event-del" onClick={()=>delCalEvent(ev.key)}>×</button>
                    </div>
                  );
                })}
              </div>
            )}
            {sortedEvents.length===0 && (
              <div className="empty" style={{paddingTop:28}}>
                <div className="empty-icon">📅</div>
                <div className="empty-txt">Tap any date to add something special.</div>
              </div>
            )}
          </div>
        )}

        {tab==="notes" && (
          <div className="section">
            <div className="note-form">
              <div className="note-form-label">Leave a love note</div>
              <div className="note-who-row">
                {["Jay","Best","Both"].map(w=>(
                  <button key={w} className={`who-btn ${who===w?"sel":""}`} onClick={()=>setWho(w)}>{w}</button>
                ))}
              </div>
              <div className="color-row">
                {NOTE_COLORS.map((c,i)=>(
                  <div key={i} className={`color-dot ${noteColor===i?"sel":""}`}
                    style={{background:c.bg,borderColor:c.border}}
                    onClick={()=>setNoteColor(i)}/>
                ))}
              </div>
              <textarea className="note-ta" placeholder="Write something sweet…" value={noteText}
                onChange={e=>setNoteText(e.target.value)}
                style={{background:NOTE_COLORS[noteColor].bg}}/>
              <button className="note-submit" disabled={!noteText.trim()} onClick={addNote}>Pin Note ♥</button>
            </div>
            {notes.length===0 && (
              <div className="empty">
                <div className="empty-icon">🌸</div>
                <div className="empty-txt">Your love notes will appear here.</div>
              </div>
            )}
            <div className="notes-grid">
              {notes.map(n=>{
                const c=NOTE_COLORS[n.color]||NOTE_COLORS[0];
                return (
                  <div key={n.id} className="note-card" style={{background:c.bg,borderColor:c.border}}>
                    <button className="note-del" onClick={()=>delNote(n.id)}>×</button>
                    <div className="note-who">{n.who}</div>
                    <div className="note-text">{n.text}</div>
                    <div className="note-date">{formatDate(n.date)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {selectedDay!==null && (
          <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget){setSelectedDay(null);setDayInput("");}}}>
            <div className="modal">
              <div className="modal-title">{MONTH_NAMES[calMonth]} {selectedDay}, {calYear}</div>
              <input className="modal-input" placeholder="What's happening? (e.g. Our Anniversary 💍)"
                value={dayInput} onChange={e=>setDayInput(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&saveDay()} autoFocus/>
              <div className="modal-btns">
                <button className="modal-cancel" onClick={()=>{setSelectedDay(null);setDayInput("");}}>Cancel</button>
                <button className="modal-save" onClick={saveDay} disabled={!dayInput.trim()}>Save Date ♥</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
