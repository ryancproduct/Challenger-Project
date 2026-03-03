/* ═══ DATA PAGE (Tables + Connectors) ═══ */

const MOCK_REGISTERS=[
  {id:"reg-inspections",name:"Inspections",records:1247,updated:"2 hours ago",status:"live",icon:IC.tasks,color:"#3B82F6",fields:["Site","Type","Date","Inspector","Score","Status"]},
  {id:"reg-actions",name:"Corrective Actions",records:384,updated:"35 min ago",status:"live",icon:IC.check,color:"#10B981",fields:["Action","Assigned To","Priority","Due Date","Status","Source"]},
  {id:"reg-incidents",name:"Incidents",records:89,updated:"1 day ago",status:"live",icon:IC.bolt,color:"#F43F5E",fields:["Incident ID","Date","Site","Severity","Root Cause","Status"]},
  {id:"reg-assets",name:"Assets",records:562,updated:"4 hours ago",status:"live",icon:IC.builder,color:"#8B5CF6",fields:["Asset ID","Name","Location","Type","Last Service","Condition"]},
  {id:"reg-training",name:"Training Records",records:2103,updated:"1 hour ago",status:"live",icon:IC.people,color:"#F59E0B",fields:["Employee","Course","Completed","Expiry","Score","Certificate"]},
  {id:"reg-observations",name:"Observations",records:731,updated:"12 min ago",status:"live",icon:IC.target,color:"#06B6D4",fields:["Observer","Date","Site","Area","Category","Risk Level"]},
  {id:"reg-permits",name:"Permits to Work",records:156,updated:"3 hours ago",status:"paused",icon:IC.shield,color:"#64748B",fields:["Permit No.","Type","Location","Issuer","Valid From","Valid To"]},
  {id:"reg-suppliers",name:"Supplier Quality",records:48,updated:"3 days ago",status:"live",icon:IC.connector,color:"#EC4899",fields:["Supplier","Rating","Last Audit","Non-conformances","Status","Tier"]},
];

function RegistersPage(){
  const[tab,setTab]=useState("tables");
  const[search,setSearch]=useState("");
  const[searchFocused,setSearchFocused]=useState(false);
  const[expandedId,setExpandedId]=useState(null);

  /* ── Connector state (mirrors ConnectorsPage logic) ── */
  const[connStates,setConnStates]=useState({});
  const[configPanel,setConfigPanel]=useState(null);
  const getConnState=(id)=>connStates[id]||{installed:false,configured:false};
  const installConn=(id)=>setConnStates(prev=>({...prev,[id]:{installed:true,configured:false}}));
  const saveConn=(id)=>{setConnStates(prev=>({...prev,[id]:{installed:true,configured:true}}));setConfigPanel(null);};
  const disconnectConn=(id)=>{setConnStates(prev=>{const n={...prev};delete n[id];return n;});setConfigPanel(null);};

  /* ── Tables filtering ── */
  const filteredTables=useMemo(()=>{
    if(!search.trim())return MOCK_REGISTERS;
    const q=search.toLowerCase();
    return MOCK_REGISTERS.filter(r=>r.name.toLowerCase().includes(q));
  },[search]);

  const totalRecords=MOCK_REGISTERS.reduce((s,r)=>s+r.records,0);

  /* ── Connector filtering ── */
  const filteredConnectors=useMemo(()=>{
    if(!search.trim()) return CONNECTOR_CATALOG;
    const q=search.toLowerCase();
    return CONNECTOR_CATALOG.map(cat=>({
      ...cat,
      connectors:cat.connectors.filter(c=>
        c.name.toLowerCase().includes(q)||c.desc.toLowerCase().includes(q)||cat.label.toLowerCase().includes(q)
      )
    })).filter(cat=>cat.connectors.length>0);
  },[search]);

  const installedConns=useMemo(()=>{
    const res=[];
    CONNECTOR_CATALOG.forEach(cat=>{
      cat.connectors.forEach(conn=>{
        if(getConnState(conn.id).installed) res.push({conn,cat});
      });
    });
    return res;
  },[connStates]);

  const totalConnectors=CONNECTOR_CATALOG.reduce((s,c)=>s+c.connectors.length,0);

  const panelData=useMemo(()=>{
    if(!configPanel) return null;
    const cat=CONNECTOR_CATALOG.find(c=>c.id===configPanel.catId);
    const conn=cat?cat.connectors.find(c=>c.id===configPanel.connId):null;
    return conn&&cat?{conn,cat}:null;
  },[configPanel]);

  const tabs=[
    {id:"tables",label:"Tables",count:MOCK_REGISTERS.length},
    {id:"connectors",label:"Connectors",count:totalConnectors},
  ];

  return<div style={{flex:1,overflowY:"auto",background:T.bg}}>
    <div style={{maxWidth:960,margin:"0 auto",padding:"28px 24px 64px"}}>

      {/* Header */}
      <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:20}}>
        <div>
          <h1 style={{fontFamily:T.serif,fontSize:24,fontWeight:500,letterSpacing:"-0.03em",color:T.text,margin:0}}>Data</h1>
          <p style={{fontSize:13,color:T.textSecondary,marginTop:4,letterSpacing:"-0.01em"}}>Tables, connectors, and data sources</p>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          {tab==="tables"&&<span style={{fontSize:11,color:T.textTertiary,fontFamily:T.mono}}>{totalRecords.toLocaleString()} records</span>}
          {tab==="connectors"&&installedConns.length>0&&<div style={{display:"flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:99,background:T.greenSoft,border:`1px solid ${T.greenBorder}`}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:T.green}}/>
            <span style={{fontSize:11,fontWeight:600,color:T.green,fontFamily:T.mono}}>{installedConns.length} connected</span>
          </div>}
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:2,marginBottom:20,background:T.surfaceMuted,borderRadius:99,padding:3,width:"fit-content"}}>
        {tabs.map(t=>{
          const active=tab===t.id;
          return<div key={t.id} onClick={()=>{setTab(t.id);setSearch("");}} style={{
            padding:"6px 18px",borderRadius:99,fontSize:12.5,fontWeight:active?600:400,
            color:active?T.text:T.textSecondary,background:active?T.surface:"transparent",
            boxShadow:active?"0 1px 3px rgba(0,0,0,0.06)":"none",
            cursor:"pointer",letterSpacing:"-0.01em",display:"flex",alignItems:"center",gap:6,
          }}>
            <span>{t.label}</span>
            <span style={{fontSize:10,fontFamily:T.mono,color:active?T.textTertiary:T.textTertiary,opacity:0.7}}>{t.count}</span>
          </div>;
        })}
      </div>

      {/* Search */}
      <div style={{marginBottom:24}}>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"11px 16px",borderRadius:T.r,background:T.surface,border:`1.5px solid ${searchFocused?T.accent:T.border}`,boxShadow:searchFocused?`0 0 0 3px ${T.accentSoft}`:T.shadow,transition:"all 0.2s"}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={searchFocused?T.accent:T.textTertiary} strokeWidth="2" strokeLinecap="round" style={{flexShrink:0,transition:"stroke 0.2s"}}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input value={search} onChange={e=>setSearch(e.target.value)} onFocus={()=>setSearchFocused(true)} onBlur={()=>setSearchFocused(false)} placeholder={tab==="tables"?"Search tables...":"Search connectors..."} style={{flex:1,border:"none",background:"none",fontSize:14,fontFamily:T.sans,color:T.text,outline:"none",letterSpacing:"-0.01em"}}/>
          {search&&<div onClick={()=>setSearch("")} style={{cursor:"pointer",display:"flex",alignItems:"center",padding:2,borderRadius:4}} onMouseEnter={e=>e.currentTarget.style.background=T.surfaceMuted} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>{IC.x(T.textTertiary,14)}</div>}
        </div>
      </div>

      {/* ═══ TABLES TAB ═══ */}
      {tab==="tables"&&<>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
          {filteredTables.map((reg,idx)=>{
            const expanded=expandedId===reg.id;
            return<div key={reg.id} onClick={()=>setExpandedId(expanded?null:reg.id)} className="bento" style={{
              padding:"18px 20px",cursor:"pointer",
              border:expanded?`1px solid ${T.accentBorder}`:`1px solid ${T.border}`,
              boxShadow:expanded?`0 0 0 2px ${T.accentSoft}`:T.shadow,
              animation:`fadeIn 0.3s ease ${idx*0.04}s both`,
            }}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                <div style={{width:36,height:36,borderRadius:10,background:`${reg.color}12`,display:"flex",alignItems:"center",justifyContent:"center"}}>{reg.icon(reg.color,18)}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:600,letterSpacing:"-0.01em",color:T.text}}>{reg.name}</div>
                  <div style={{fontSize:11,color:T.textTertiary,marginTop:1}}>Updated {reg.updated}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:99,background:reg.status==="live"?T.greenSoft:T.amberSoft}}>
                  <div style={{width:5,height:5,borderRadius:"50%",background:reg.status==="live"?T.green:T.amber}}/>
                  <span style={{fontSize:9.5,fontWeight:600,color:reg.status==="live"?T.green:T.amber,fontFamily:T.mono,textTransform:"capitalize"}}>{reg.status}</span>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span style={{fontSize:12,fontFamily:T.mono,color:T.textSecondary}}>{reg.records.toLocaleString()} records</span>
                <span style={{fontSize:11,color:T.textTertiary}}>{reg.fields.length} fields</span>
              </div>
              {expanded&&<div style={{marginTop:14,paddingTop:12,borderTop:`1px solid ${T.borderSubtle}`,animation:"fadeIn 0.2s ease"}}>
                <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.06em",fontFamily:T.mono,color:T.textTertiary,marginBottom:8}}>Fields</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                  {reg.fields.map(f=><span key={f} style={{padding:"3px 10px",borderRadius:99,background:T.surfaceMuted,fontSize:11,color:T.textSecondary,fontFamily:T.mono}}>{f}</span>)}
                </div>
              </div>}
            </div>;
          })}
        </div>
        {filteredTables.length===0&&search&&<div style={{textAlign:"center",padding:"60px 0"}}>
          <div style={{fontSize:13,color:T.textTertiary}}>No tables match "{search}"</div>
        </div>}
      </>}

      {/* ═══ CONNECTORS TAB ═══ */}
      {tab==="connectors"&&<>
        {/* Installed section */}
        {installedConns.length>0&&!search.trim()&&<div style={{marginBottom:32}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
            <span style={{fontSize:12.5,fontWeight:600,color:T.text,letterSpacing:"-0.01em"}}>Installed</span>
            <span style={{padding:"2px 7px",borderRadius:99,background:T.accentSoft,fontSize:10,fontWeight:600,color:T.textSecondary,fontFamily:T.mono}}>{installedConns.length}</span>
          </div>
          <div className="connector-grid">
            {installedConns.map(({conn,cat})=>{
              const st=getConnState(conn.id);
              return<ConnectorCard key={conn.id} conn={conn} cat={cat} isInstalled={true} isConfigured={st.configured} onAction={()=>setConfigPanel({connId:conn.id,catId:cat.id})}/>;
            })}
          </div>
          <div style={{height:1,background:T.borderSubtle,margin:"28px 0 0"}}/>
        </div>}

        {/* Category sections */}
        <div style={{display:"flex",flexDirection:"column",gap:28}}>
          {filteredConnectors.map(cat=><div key={cat.id} style={{animation:"fadeIn 0.3s ease"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:cat.color,flexShrink:0}}/>
              <span style={{fontSize:12.5,fontWeight:600,color:T.text,letterSpacing:"-0.01em"}}>{cat.label}</span>
              <span style={{fontSize:10.5,color:T.textTertiary,fontFamily:T.mono}}>{cat.connectors.length}</span>
            </div>
            <div className="connector-grid">
              {cat.connectors.map(conn=>{
                const st=getConnState(conn.id);
                return<ConnectorCard key={conn.id} conn={conn} cat={cat} isInstalled={st.installed} isConfigured={st.configured} onAction={()=>{
                  if(st.installed) setConfigPanel({connId:conn.id,catId:cat.id});
                  else installConn(conn.id);
                }}/>;
              })}
            </div>
          </div>)}
        </div>

        {/* Empty search */}
        {filteredConnectors.length===0&&search&&<div style={{textAlign:"center",padding:"60px 0"}}>
          <div style={{width:48,height:48,borderRadius:12,background:T.surfaceMuted,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.textTertiary} strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
          <div style={{fontSize:13,fontWeight:500,color:T.textSecondary}}>No connectors match "{search}"</div>
          <div style={{fontSize:12,color:T.textTertiary,marginTop:4}}>Try a different search term</div>
        </div>}
      </>}
    </div>

    {/* Connector config panel */}
    {panelData&&<ConnectorConfigPanel conn={panelData.conn} cat={panelData.cat} isConfigured={getConnState(panelData.conn.id).configured} onClose={()=>setConfigPanel(null)} onSave={()=>saveConn(panelData.conn.id)} onDisconnect={()=>disconnectConn(panelData.conn.id)}/>}
  </div>;
}
