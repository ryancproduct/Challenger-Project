/* ═══ SCORE PAGE (Dashboard + Predictions + Benchmarking) ═══ */

/* ── Score sites (reuses SITES from people.jsx but adds score-specific data) ── */
const SCORE_SITES=[
  {id:"all",name:"All Sites",type:"Aggregate",color:T.accent},
  {id:"plant-a",name:"Plant Alpha",type:"Manufacturing",color:"#8B5CF6"},
  {id:"plant-b",name:"Plant Beta",type:"Manufacturing",color:"#F59E0B"},
  {id:"hq",name:"HQ — Portland",type:"Office",color:"#3B82F6"},
  {id:"warehouse",name:"Distribution Center",type:"Warehouse",color:"#10B981"},
];

/* ── Per-site score modifiers (multiplied against base goal scores) ── */
const SITE_SCORE_MODIFIERS={
  "all":{multiplier:1.0,trendOffset:0},
  "plant-a":{multiplier:1.08,trendOffset:0.1},
  "plant-b":{multiplier:0.88,trendOffset:-0.1},
  "hq":{multiplier:1.15,trendOffset:0.2},
  "warehouse":{multiplier:0.95,trendOffset:0.0},
};

const SITE_SIGNAL_MODIFIERS={
  "all":{inspections:0,actions:0,training:0,incidents:0,assets:0,observations:0},
  "plant-a":{inspections:6,actions:4,training:8,incidents:-3,assets:5,observations:3},
  "plant-b":{inspections:-8,actions:-6,training:-4,incidents:5,assets:-7,observations:-5},
  "hq":{inspections:10,actions:12,training:14,incidents:-8,assets:8,observations:10},
  "warehouse":{inspections:-3,actions:-2,training:2,incidents:3,assets:-4,observations:-1},
};

function getSiteScore(baseScore,siteId){
  const mod=SITE_SCORE_MODIFIERS[siteId]||SITE_SCORE_MODIFIERS["all"];
  return Math.min(5.0,Math.max(0,Math.round(baseScore*mod.multiplier*10)/10));
}
function getSiteTrend(baseTrend,siteId){
  const mod=SITE_SCORE_MODIFIERS[siteId]||SITE_SCORE_MODIFIERS["all"];
  return Math.round((baseTrend+mod.trendOffset)*10)/10;
}
function getSiteSignals(baseSignals,siteId){
  const mod=SITE_SIGNAL_MODIFIERS[siteId]||SITE_SIGNAL_MODIFIERS["all"];
  const result={};
  Object.keys(baseSignals).forEach(k=>{result[k]=Math.min(100,Math.max(0,baseSignals[k]+(mod[k]||0)));});
  return result;
}

/* ── Mock prediction data (per site) ── */
const MOCK_PREDICTIONS={
  "all":[
    {id:"pred-1",goal:"Unplanned Downtime",current:2.5,predicted:3.1,confidence:78,timeframe:"90 days",direction:"up",insight:"Preventive maintenance completion trending upward — expect score improvement if sustained"},
    {id:"pred-2",goal:"Defect Rate",current:4.1,predicted:4.3,confidence:85,timeframe:"60 days",direction:"up",insight:"First-pass yield improving steadily across all lines"},
    {id:"pred-3",goal:"Employee Turnover",current:2.6,predicted:2.2,confidence:62,timeframe:"90 days",direction:"down",insight:"Training completion declining — risk of increased attrition if not addressed"},
    {id:"pred-4",goal:"OEE",current:3.8,predicted:3.5,confidence:71,timeframe:"60 days",direction:"down",insight:"Changeover times increasing on Line 3 — will drag overall OEE if not corrected"},
    {id:"pred-5",goal:"Regulatory Compliance",current:4.3,predicted:4.4,confidence:91,timeframe:"30 days",direction:"up",insight:"All audit actions on track for completion before next regulatory review"},
    {id:"pred-6",goal:"Injury Rate",current:3.9,predicted:4.1,confidence:74,timeframe:"60 days",direction:"up",insight:"Near-miss reporting up 40% — leading indicator of improved safety culture"},
    {id:"pred-7",goal:"Supplier Quality",current:3.0,predicted:2.7,confidence:66,timeframe:"90 days",direction:"down",insight:"Two key suppliers flagged for non-conformance — incoming quality at risk"},
    {id:"pred-8",goal:"Training Compliance",current:3.5,predicted:3.8,confidence:80,timeframe:"60 days",direction:"up",insight:"New onboarding programme showing faster time-to-competency"},
  ],
  "plant-a":[
    {id:"pa-1",goal:"OEE",current:4.1,predicted:4.4,confidence:82,timeframe:"60 days",direction:"up",insight:"Line 1 throughput up 12% after changeover optimisation"},
    {id:"pa-2",goal:"Defect Rate",current:4.4,predicted:4.6,confidence:88,timeframe:"60 days",direction:"up",insight:"SPC implementation reducing variation on critical dimensions"},
    {id:"pa-3",goal:"Unplanned Downtime",current:2.7,predicted:3.2,confidence:72,timeframe:"90 days",direction:"up",insight:"New PM schedule on critical assets showing early improvements"},
    {id:"pa-4",goal:"Injury Rate",current:4.2,predicted:4.0,confidence:65,timeframe:"90 days",direction:"down",insight:"Contractor safety incidents trending up in maintenance window"},
  ],
  "plant-b":[
    {id:"pb-1",goal:"OEE",current:3.3,predicted:2.9,confidence:74,timeframe:"60 days",direction:"down",insight:"Equipment age on Line 2 causing unplanned stops — capital request pending"},
    {id:"pb-2",goal:"Defect Rate",current:3.6,predicted:3.8,confidence:70,timeframe:"90 days",direction:"up",insight:"New quality gate added at station 4 catching defects earlier"},
    {id:"pb-3",goal:"Employee Turnover",current:2.3,predicted:1.9,confidence:68,timeframe:"90 days",direction:"down",insight:"Night shift retention declining — compensation review needed"},
    {id:"pb-4",goal:"Safety Compliance",current:2.8,predicted:3.1,confidence:76,timeframe:"60 days",direction:"up",insight:"Safety stand-down and retraining programme underway"},
  ],
  "hq":[
    {id:"hq-1",goal:"Regulatory Compliance",current:4.6,predicted:4.7,confidence:92,timeframe:"30 days",direction:"up",insight:"All documentation up to date for upcoming ISO audit"},
    {id:"hq-2",goal:"Training Compliance",current:4.2,predicted:4.4,confidence:86,timeframe:"60 days",direction:"up",insight:"Leadership training programme achieving 95% completion rate"},
    {id:"hq-3",goal:"Supplier Quality",current:3.4,predicted:3.1,confidence:70,timeframe:"90 days",direction:"down",insight:"Procurement flagged two vendors for quality escapes last quarter"},
  ],
  "warehouse":[
    {id:"wh-1",goal:"Inventory Accuracy",current:3.2,predicted:3.6,confidence:78,timeframe:"60 days",direction:"up",insight:"Cycle count programme and barcode scanning reducing discrepancies"},
    {id:"wh-2",goal:"OTIF Delivery",current:3.5,predicted:3.3,confidence:64,timeframe:"90 days",direction:"down",insight:"Carrier delays increasing — need to diversify shipping partners"},
    {id:"wh-3",goal:"Safety Compliance",current:3.0,predicted:3.3,confidence:72,timeframe:"60 days",direction:"up",insight:"Forklift safety programme and dock loading procedures improving"},
    {id:"wh-4",goal:"Asset Utilisation",current:2.8,predicted:3.0,confidence:68,timeframe:"90 days",direction:"up",insight:"Racking optimisation project freeing up 15% more storage capacity"},
  ],
};

/* ── Mock benchmark data (per site) ── */
const SITE_BENCHMARKS={
  "all":[
    {id:"bench-safety",name:"Safety & Compliance",yourScore:4.1,industryAvg:3.4,topQuartile:4.5,percentile:78},
    {id:"bench-quality",name:"Quality Management",yourScore:3.8,industryAvg:3.2,topQuartile:4.3,percentile:72},
    {id:"bench-maintenance",name:"Maintenance & Reliability",yourScore:2.7,industryAvg:3.0,topQuartile:4.0,percentile:38},
    {id:"bench-operations",name:"Production Operations",yourScore:3.5,industryAvg:3.3,topQuartile:4.2,percentile:62},
    {id:"bench-people",name:"People & Training",yourScore:3.1,industryAvg:2.9,topQuartile:3.8,percentile:58},
    {id:"bench-supply",name:"Supply Chain",yourScore:3.2,industryAvg:3.1,topQuartile:4.1,percentile:55},
  ],
  "plant-a":[
    {id:"bench-safety",name:"Safety & Compliance",yourScore:4.4,industryAvg:3.4,topQuartile:4.5,percentile:86},
    {id:"bench-quality",name:"Quality Management",yourScore:4.2,industryAvg:3.2,topQuartile:4.3,percentile:82},
    {id:"bench-maintenance",name:"Maintenance & Reliability",yourScore:3.1,industryAvg:3.0,topQuartile:4.0,percentile:52},
    {id:"bench-operations",name:"Production Operations",yourScore:4.0,industryAvg:3.3,topQuartile:4.2,percentile:78},
    {id:"bench-people",name:"People & Training",yourScore:3.4,industryAvg:2.9,topQuartile:3.8,percentile:68},
    {id:"bench-supply",name:"Supply Chain",yourScore:3.5,industryAvg:3.1,topQuartile:4.1,percentile:65},
  ],
  "plant-b":[
    {id:"bench-safety",name:"Safety & Compliance",yourScore:3.2,industryAvg:3.4,topQuartile:4.5,percentile:42},
    {id:"bench-quality",name:"Quality Management",yourScore:3.4,industryAvg:3.2,topQuartile:4.3,percentile:56},
    {id:"bench-maintenance",name:"Maintenance & Reliability",yourScore:2.2,industryAvg:3.0,topQuartile:4.0,percentile:22},
    {id:"bench-operations",name:"Production Operations",yourScore:3.0,industryAvg:3.3,topQuartile:4.2,percentile:40},
    {id:"bench-people",name:"People & Training",yourScore:2.5,industryAvg:2.9,topQuartile:3.8,percentile:32},
    {id:"bench-supply",name:"Supply Chain",yourScore:2.8,industryAvg:3.1,topQuartile:4.1,percentile:38},
  ],
  "hq":[
    {id:"bench-safety",name:"Safety & Compliance",yourScore:4.6,industryAvg:3.4,topQuartile:4.5,percentile:92},
    {id:"bench-quality",name:"Quality Management",yourScore:4.0,industryAvg:3.2,topQuartile:4.3,percentile:76},
    {id:"bench-maintenance",name:"Maintenance & Reliability",yourScore:3.8,industryAvg:3.0,topQuartile:4.0,percentile:74},
    {id:"bench-operations",name:"Production Operations",yourScore:3.9,industryAvg:3.3,topQuartile:4.2,percentile:72},
    {id:"bench-people",name:"People & Training",yourScore:4.2,industryAvg:2.9,topQuartile:3.8,percentile:88},
    {id:"bench-supply",name:"Supply Chain",yourScore:3.4,industryAvg:3.1,topQuartile:4.1,percentile:60},
  ],
  "warehouse":[
    {id:"bench-safety",name:"Safety & Compliance",yourScore:3.5,industryAvg:3.4,topQuartile:4.5,percentile:54},
    {id:"bench-quality",name:"Quality Management",yourScore:3.2,industryAvg:3.2,topQuartile:4.3,percentile:50},
    {id:"bench-maintenance",name:"Maintenance & Reliability",yourScore:2.9,industryAvg:3.0,topQuartile:4.0,percentile:44},
    {id:"bench-operations",name:"Production Operations",yourScore:3.3,industryAvg:3.3,topQuartile:4.2,percentile:50},
    {id:"bench-people",name:"People & Training",yourScore:3.0,industryAvg:2.9,topQuartile:3.8,percentile:52},
    {id:"bench-supply",name:"Supply Chain",yourScore:3.5,industryAvg:3.1,topQuartile:4.1,percentile:62},
  ],
};

function ScorePage({selectedGoals,industry,onNavigate}){
  const[tab,setTab]=useState("dashboard");
  const[lens,setLens]=useState("risk");
  const[activeSite,setActiveSite]=useState("all");
  const allGoals=getGoalsByIndustry(industry);
  const activeGoals=allGoals.filter(g=>selectedGoals.includes(g.id));

  const signalLabels={inspections:"Inspections",actions:"Actions",training:"Training",incidents:"Incidents",assets:"Assets",observations:"Observations"};

  /* ── Site-adjusted scores ── */
  const scoredGoals=useMemo(()=>
    activeGoals.map(g=>{
      const base=GOAL_SCORES[g.id]||{score:0,trend:0,signals:{}};
      return{...g,scoreData:{
        score:getSiteScore(base.score,activeSite),
        trend:getSiteTrend(base.trend,activeSite),
        signals:getSiteSignals(base.signals,activeSite),
      }};
    }).sort((a,b)=>lens==="risk"?a.scoreData.score-b.scoreData.score:b.scoreData.score-a.scoreData.score)
  ,[activeGoals,lens,activeSite]);

  const siteAgg=useMemo(()=>{
    if(scoredGoals.length===0)return{score:0,trend:0,count:0};
    const total=scoredGoals.reduce((s,g)=>s+g.scoreData.score,0);
    const trendTotal=scoredGoals.reduce((s,g)=>s+g.scoreData.trend,0);
    return{score:Math.round((total/scoredGoals.length)*10)/10,trend:Math.round((trendTotal/scoredGoals.length)*10)/10,count:scoredGoals.length};
  },[scoredGoals]);

  const siteSignals=useMemo(()=>{
    const baseSignals=computeSignalAverages(selectedGoals);
    return getSiteSignals(baseSignals,activeSite);
  },[selectedGoals,activeSite]);

  const topRisks=scoredGoals.filter(g=>g.scoreData.score>0&&g.scoreData.score<3.0);
  const topStrengths=scoredGoals.filter(g=>g.scoreData.score>=3.5);

  const tabs=[
    {id:"dashboard",label:"Dashboard"},
    {id:"predictions",label:"Predictions"},
    {id:"benchmarking",label:"Benchmarking"},
  ];

  const hasGoals=activeGoals.length>0;
  const currentSite=SCORE_SITES.find(s=>s.id===activeSite)||SCORE_SITES[0];
  const sitePredictions=MOCK_PREDICTIONS[activeSite]||MOCK_PREDICTIONS["all"];
  const siteBenchmarks=SITE_BENCHMARKS[activeSite]||SITE_BENCHMARKS["all"];

  /* ── Site selector component ── */
  const SiteSelector=()=><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
    {SCORE_SITES.map(site=>{
      const active=activeSite===site.id;
      return<div key={site.id} onClick={()=>setActiveSite(site.id)} style={{
        display:"flex",alignItems:"center",gap:7,padding:"6px 14px",borderRadius:99,
        background:active?`${site.color}12`:T.surface,
        border:`1.5px solid ${active?site.color:T.border}`,
        cursor:"pointer",transition:"all 0.2s",
      }} onMouseEnter={e=>{if(!active){e.currentTarget.style.borderColor=site.color;e.currentTarget.style.background=`${site.color}06`;}}} onMouseLeave={e=>{if(!active){e.currentTarget.style.borderColor=T.border;e.currentTarget.style.background=T.surface;}}}>
        <div style={{width:7,height:7,borderRadius:"50%",background:site.color,flexShrink:0}}/>
        <span style={{fontSize:12,fontWeight:active?600:400,color:active?T.text:T.textSecondary,whiteSpace:"nowrap"}}>{site.name}</span>
      </div>;
    })}
  </div>;

  return<div style={{flex:1,overflowY:"auto",background:T.bg}}>
    <div style={{maxWidth:960,margin:"0 auto",padding:"28px 24px 64px"}}>

      {/* Header */}
      <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:16}}>
        <div>
          <h1 style={{fontFamily:T.serif,fontSize:24,fontWeight:500,letterSpacing:"-0.03em",color:T.text,margin:0}}>Score</h1>
          <p style={{fontSize:13,color:T.textSecondary,marginTop:4,letterSpacing:"-0.01em"}}>Operational readiness, predictions, and benchmarks</p>
        </div>
        {tab==="dashboard"&&hasGoals&&<LensToggle lens={lens} setLens={setLens}/>}
      </div>

      {/* Site selector */}
      <div style={{marginBottom:16}}><SiteSelector/></div>

      {/* Tabs */}
      <div style={{display:"flex",gap:2,marginBottom:24,background:T.surfaceMuted,borderRadius:99,padding:3,width:"fit-content"}}>
        {tabs.map(t=>{
          const active=tab===t.id;
          return<div key={t.id} onClick={()=>setTab(t.id)} style={{
            padding:"6px 18px",borderRadius:99,fontSize:12.5,fontWeight:active?600:400,
            color:active?T.text:T.textSecondary,background:active?T.surface:"transparent",
            boxShadow:active?"0 1px 3px rgba(0,0,0,0.06)":"none",
            cursor:"pointer",letterSpacing:"-0.01em",
          }}>{t.label}</div>;
        })}
      </div>

      {/* ═══ DASHBOARD TAB ═══ */}
      {tab==="dashboard"&&<>{!hasGoals?<div style={{textAlign:"center",padding:"80px 0"}}>
        <div style={{width:56,height:56,borderRadius:16,background:T.surfaceMuted,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>{IC.target(T.textTertiary,24)}</div>
        <div style={{fontFamily:T.serif,fontSize:18,fontWeight:500,marginBottom:6}}>No goals selected</div>
        <div style={{fontSize:13,color:T.textSecondary,marginBottom:20}}>Select goals to see your operational score</div>
        <div onClick={()=>onNavigate("goals")} className="action-chip primary">Set up goals</div>
      </div>:<>
        {/* Aggregate score card */}
        <div className="bento" style={{padding:"28px 32px",marginBottom:20,borderLeft:`4px solid ${currentSite.color}`}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:20}}>
            <div>
              <div className="lbl" style={{marginBottom:8,display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:currentSite.color}}/>
                {currentSite.name}{activeSite!=="all"&&<span style={{color:T.textTertiary,fontWeight:400}}> — {currentSite.type}</span>}
              </div>
              <ScoreBadge score={siteAgg.score} trend={siteAgg.trend}/>
              <div style={{marginTop:8}}><StarRating score={siteAgg.score} size={22} gap={3}/></div>
            </div>
            <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
              <div style={{textAlign:"center"}}>
                <div style={{fontFamily:T.serif,fontSize:28,fontWeight:500,color:T.text}}>{siteAgg.count}</div>
                <div style={{fontSize:11,color:T.textTertiary,fontFamily:T.mono}}>Active Goals</div>
              </div>
              <div style={{textAlign:"center"}}>
                <div style={{fontFamily:T.serif,fontSize:28,fontWeight:500,color:T.green}}>{topStrengths.length}</div>
                <div style={{fontSize:11,color:T.textTertiary,fontFamily:T.mono}}>Strong</div>
              </div>
              <div style={{textAlign:"center"}}>
                <div style={{fontFamily:T.serif,fontSize:28,fontWeight:500,color:T.rose}}>{topRisks.length}</div>
                <div style={{fontSize:11,color:T.textTertiary,fontFamily:T.mono}}>At Risk</div>
              </div>
            </div>
          </div>
        </div>

        {/* Site comparison strip (only when viewing All Sites) */}
        {activeSite==="all"&&<div style={{display:"grid",gridTemplateColumns:`repeat(${SCORE_SITES.length-1},1fr)`,gap:10,marginBottom:20}}>
          {SCORE_SITES.filter(s=>s.id!=="all").map(site=>{
            const mod=SITE_SCORE_MODIFIERS[site.id];
            const siteScore=Math.min(5.0,Math.round(siteAgg.score*mod.multiplier*10)/10);
            const color=siteScore<3.0?T.rose:siteScore>=3.5?T.green:T.amber;
            return<div key={site.id} onClick={()=>setActiveSite(site.id)} className="bento" style={{padding:"16px 18px",cursor:"pointer",borderTop:`3px solid ${site.color}`,transition:"all 0.2s"}}>
              <div style={{fontSize:12,fontWeight:600,color:T.text,marginBottom:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{site.name}</div>
              <div style={{fontSize:10,color:T.textTertiary,fontFamily:T.mono,marginBottom:10}}>{site.type}</div>
              <div style={{display:"flex",alignItems:"baseline",gap:4}}>
                <span style={{fontFamily:T.serif,fontSize:22,fontWeight:500,color}}>{siteScore}</span>
                <span style={{fontSize:11,color:T.textTertiary}}>/5</span>
              </div>
              <div style={{marginTop:6}}><StarRating score={siteScore} size={10} gap={1}/></div>
            </div>;
          })}
        </div>}

        {/* Signal breakdown */}
        <div className="grid-bento" style={{marginBottom:24}}>
          <div className="col-7">
            <div className="bento" style={{padding:"22px 24px"}}>
              <div className="lbl" style={{marginBottom:16}}>Signal Health</div>
              {Object.entries(siteSignals).map(([key,val])=>
                <SignalBar key={key} label={signalLabels[key]||key} value={val}/>
              )}
            </div>
          </div>
          <div className="col-5">
            <div className="bento" style={{padding:"22px 24px",height:"100%",display:"flex",flexDirection:"column"}}>
              <div className="lbl" style={{marginBottom:14}}>{lens==="risk"?"Top Risks":"Top Strengths"}</div>
              <div style={{flex:1,display:"flex",flexDirection:"column",gap:8}}>
                {(lens==="risk"?topRisks:topStrengths).slice(0,5).map(g=>{
                  const color=g.scoreData.score<3.0?T.rose:g.scoreData.score>=3.5?T.green:T.amber;
                  return<div key={g.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 12px",borderRadius:T.rSm,background:T.surfaceHover}}>
                    <span style={{fontSize:12.5,color:T.text,fontWeight:500,flex:1,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{g.name}</span>
                    <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
                      <span style={{fontSize:12,fontWeight:600,fontFamily:T.mono,color}}>{g.scoreData.score}</span>
                      {g.scoreData.trend!==0&&<span style={{fontSize:10,color:g.scoreData.trend>0?T.green:T.rose}}>{g.scoreData.trend>0?"↑":"↓"}{Math.abs(g.scoreData.trend)}</span>}
                    </div>
                  </div>;
                })}
                {(lens==="risk"?topRisks:topStrengths).length===0&&<div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:T.textTertiary,fontSize:12}}>
                  {lens==="risk"?"No goals at risk":"No strong goals yet"}
                </div>}
              </div>
            </div>
          </div>
        </div>

        {/* All goals table */}
        <div className="bento" style={{padding:"22px 24px"}}>
          <div className="lbl" style={{marginBottom:14}}>All Goals</div>
          <div style={{display:"flex",flexDirection:"column",gap:4}}>
            {scoredGoals.map((g,idx)=>{
              const s=g.scoreData;
              const color=s.score<3.0?T.rose:s.score>=3.5?T.green:T.amber;
              return<div key={g.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",borderRadius:T.rSm,transition:"background 0.15s",cursor:"pointer",animation:`fadeIn 0.25s ease ${idx*0.02}s both`}} onMouseEnter={e=>e.currentTarget.style.background=T.surfaceHover} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div style={{width:8,height:8,borderRadius:"50%",background:color,flexShrink:0}}/>
                <span style={{flex:1,fontSize:13,color:T.text,fontWeight:500,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{g.name}</span>
                <span style={{fontSize:11,color:T.textTertiary,fontFamily:T.mono,flexShrink:0}}>{g.category}</span>
                <div style={{display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
                  <StarRating score={s.score} size={10} gap={1}/>
                  <span style={{fontSize:12,fontWeight:600,fontFamily:T.mono,color,minWidth:28,textAlign:"right"}}>{s.score}</span>
                </div>
                {s.trend!==0&&<span className="chip" style={{background:s.trend>0?T.greenSoft:T.roseSoft,color:s.trend>0?T.green:T.rose,flexShrink:0}}>{s.trend>0?"↑":"↓"}{Math.abs(s.trend)}</span>}
              </div>;
            })}
          </div>
        </div>
      </>}</>}

      {/* ═══ PREDICTIONS TAB ═══ */}
      {tab==="predictions"&&<>
        {/* Summary banner */}
        <div className="bento" style={{padding:"22px 28px",marginBottom:24,background:`linear-gradient(135deg, ${T.surface} 0%, ${T.accentSoft} 100%)`,border:`1px solid ${T.accentBorder}`}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:44,height:44,borderRadius:12,background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{IC.sparkle("#fff",20)}</div>
            <div>
              <div style={{fontSize:15,fontWeight:600,letterSpacing:"-0.01em",marginBottom:2}}>AI Score Predictions{activeSite!=="all"&&<span style={{fontWeight:400,color:T.textSecondary}}> — {currentSite.name}</span>}</div>
              <div style={{fontSize:12.5,color:T.textSecondary,lineHeight:1.5}}>Based on current signal trends, workflow completion rates, and historical patterns. Predictions update daily.</div>
            </div>
          </div>
        </div>

        {/* Prediction summary */}
        <div style={{display:"flex",gap:14,marginBottom:24}}>
          {[
            {label:"Improving",count:sitePredictions.filter(p=>p.direction==="up").length,color:T.green},
            {label:"Declining",count:sitePredictions.filter(p=>p.direction==="down").length,color:T.rose},
            {label:"Avg Confidence",count:Math.round(sitePredictions.reduce((s,p)=>s+p.confidence,0)/sitePredictions.length)+"%",color:T.accent},
          ].map(s=><div key={s.label} className="bento" style={{flex:1,padding:"16px 20px",textAlign:"center"}}>
            <div style={{fontFamily:T.serif,fontSize:24,fontWeight:500,color:s.color}}>{s.count}</div>
            <div style={{fontSize:11,color:T.textTertiary,fontFamily:T.mono,marginTop:2}}>{s.label}</div>
          </div>)}
        </div>

        {/* Prediction cards */}
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {sitePredictions.map((p,idx)=>{
            const improving=p.direction==="up";
            const color=improving?T.green:T.rose;
            const bg=improving?T.greenSoft:T.roseSoft;
            const delta=Math.abs(p.predicted-p.current).toFixed(1);
            return<div key={p.id} className="bento" style={{padding:"18px 22px",animation:`fadeIn 0.3s ease ${idx*0.04}s both`}}>
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:40,height:40,borderRadius:10,background:bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span style={{fontSize:18,color}}>{improving?"↑":"↓"}</span>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <span style={{fontSize:14,fontWeight:600,letterSpacing:"-0.01em",color:T.text}}>{p.goal}</span>
                    <span className="chip" style={{background:bg,color}}>{improving?"+":"-"}{delta} in {p.timeframe}</span>
                  </div>
                  <div style={{fontSize:12,color:T.textSecondary,lineHeight:1.5}}>{p.insight}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontSize:10,color:T.textTertiary,fontFamily:T.mono,marginBottom:2}}>Current</div>
                    <div style={{fontSize:16,fontWeight:600,fontFamily:T.mono,color:T.text}}>{p.current}</div>
                  </div>
                  <div style={{color:T.textTertiary,fontSize:14}}>→</div>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontSize:10,color:T.textTertiary,fontFamily:T.mono,marginBottom:2}}>Predicted</div>
                    <div style={{fontSize:16,fontWeight:600,fontFamily:T.mono,color}}>{p.predicted}</div>
                  </div>
                </div>
                <div style={{width:52,flexShrink:0,textAlign:"center"}}>
                  <MiniRing pct={p.confidence} size={36} stroke={3.5} color={p.confidence>=75?T.green:p.confidence>=50?T.amber:T.rose}/>
                  <div style={{fontSize:9.5,color:T.textTertiary,fontFamily:T.mono,marginTop:3}}>{p.confidence}%</div>
                </div>
              </div>
            </div>;
          })}
        </div>
      </>}

      {/* ═══ BENCHMARKING TAB ═══ */}
      {tab==="benchmarking"&&<>
        {/* Industry context */}
        <div className="bento" style={{padding:"22px 28px",marginBottom:24,borderLeft:`4px solid ${currentSite.color}`}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
            <div>
              <div className="lbl" style={{marginBottom:6}}>Industry Benchmark{activeSite!=="all"&&<span style={{textTransform:"none",letterSpacing:0}}> — {currentSite.name}</span>}</div>
              <div style={{fontSize:16,fontWeight:600,letterSpacing:"-0.01em"}}>{(INDUSTRIES.find(i=>i.id===industry)||{}).label||"Manufacturing"}</div>
              <div style={{fontSize:12,color:T.textSecondary,marginTop:2}}>Compared against {activeSite==="all"?"organisations":"similar sites"} in your industry</div>
            </div>
            <div style={{display:"flex",gap:16}}>
              <div style={{textAlign:"center",padding:"10px 16px",borderRadius:T.rSm,background:T.surfaceHover}}>
                <div style={{fontFamily:T.serif,fontSize:24,fontWeight:500,color:currentSite.color}}>{hasGoals?siteAgg.score:"—"}</div>
                <div style={{fontSize:10,color:T.textTertiary,fontFamily:T.mono}}>{activeSite==="all"?"Your Score":"Site Score"}</div>
              </div>
              <div style={{textAlign:"center",padding:"10px 16px",borderRadius:T.rSm,background:T.surfaceHover}}>
                <div style={{fontFamily:T.serif,fontSize:24,fontWeight:500,color:T.textSecondary}}>3.2</div>
                <div style={{fontSize:10,color:T.textTertiary,fontFamily:T.mono}}>Industry Avg</div>
              </div>
              <div style={{textAlign:"center",padding:"10px 16px",borderRadius:T.rSm,background:T.surfaceHover}}>
                <div style={{fontFamily:T.serif,fontSize:24,fontWeight:500,color:T.green}}>4.3</div>
                <div style={{fontSize:10,color:T.textTertiary,fontFamily:T.mono}}>Top Quartile</div>
              </div>
            </div>
          </div>
        </div>

        {/* Benchmark cards */}
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {siteBenchmarks.map((b,idx)=>{
            const vsAvg=b.yourScore-b.industryAvg;
            const aboveAvg=vsAvg>=0;
            const pctColor=b.percentile>=75?T.green:b.percentile>=50?T.accent:b.percentile>=25?T.amber:T.rose;
            return<div key={b.id} className="bento" style={{padding:"20px 24px",animation:`fadeIn 0.3s ease ${idx*0.05}s both`}}>
              <div style={{display:"flex",alignItems:"center",gap:16}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:14,fontWeight:600,letterSpacing:"-0.01em",marginBottom:6}}>{b.name}</div>
                  <div style={{display:"flex",flexDirection:"column",gap:4}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:10,fontFamily:T.mono,color:T.textTertiary,width:65,flexShrink:0}}>You</span>
                      <div style={{flex:1,height:8,borderRadius:4,background:T.surfaceMuted,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${(b.yourScore/5)*100}%`,borderRadius:4,background:currentSite.color,transition:"width 0.8s cubic-bezier(0.4,0,0.2,1)"}}/>
                      </div>
                      <span style={{fontSize:11,fontWeight:600,fontFamily:T.mono,color:currentSite.color,width:28,textAlign:"right"}}>{b.yourScore}</span>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:10,fontFamily:T.mono,color:T.textTertiary,width:65,flexShrink:0}}>Industry</span>
                      <div style={{flex:1,height:8,borderRadius:4,background:T.surfaceMuted,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${(b.industryAvg/5)*100}%`,borderRadius:4,background:T.textTertiary,opacity:0.5,transition:"width 0.8s cubic-bezier(0.4,0,0.2,1)"}}/>
                      </div>
                      <span style={{fontSize:11,fontWeight:500,fontFamily:T.mono,color:T.textTertiary,width:28,textAlign:"right"}}>{b.industryAvg}</span>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:10,fontFamily:T.mono,color:T.textTertiary,width:65,flexShrink:0}}>Top 25%</span>
                      <div style={{flex:1,height:8,borderRadius:4,background:T.surfaceMuted,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${(b.topQuartile/5)*100}%`,borderRadius:4,background:T.green,opacity:0.4,transition:"width 0.8s cubic-bezier(0.4,0,0.2,1)"}}/>
                      </div>
                      <span style={{fontSize:11,fontWeight:500,fontFamily:T.mono,color:T.green,width:28,textAlign:"right"}}>{b.topQuartile}</span>
                    </div>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:14,flexShrink:0}}>
                  <div style={{textAlign:"center"}}>
                    <MiniRing pct={b.percentile} size={44} stroke={4} color={pctColor}/>
                    <div style={{fontSize:10,fontFamily:T.mono,color:T.textTertiary,marginTop:4}}>P{b.percentile}</div>
                  </div>
                  <div style={{textAlign:"center",minWidth:56}}>
                    <span className="chip" style={{background:aboveAvg?T.greenSoft:T.roseSoft,color:aboveAvg?T.green:T.rose,fontSize:11,fontWeight:600}}>
                      {aboveAvg?"+":""}{vsAvg.toFixed(1)} vs avg
                    </span>
                  </div>
                </div>
              </div>
            </div>;
          })}
        </div>

        <div style={{textAlign:"center",padding:"32px 0 0",fontSize:11.5,color:T.textTertiary,lineHeight:1.6}}>
          Benchmarks are based on anonymised, aggregated data from {activeSite==="all"?"organisations":"similar sites"} in your industry.<br/>
          Updated monthly. Last refreshed 28 Feb 2026.
        </div>
      </>}

    </div>
  </div>;
}
