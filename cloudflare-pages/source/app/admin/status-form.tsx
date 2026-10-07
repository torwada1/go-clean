"use client";
import {useState} from 'react';

export const statuses:Record<string,string> = {
  pending:'حجز جديد', confirmed:'مؤكد', completed:'تمت الزيارة',
  cancelled:'ملغي', no_show:'لم تتم الزيارة', problem:'حدثت مشكلة'
};

export default function StatusForm({booking,busy,onSave}:{booking:any,busy:boolean,onSave:(value:any)=>void}) {
  const [status,setStatus]=useState(booking.status);
  const needsComment=['cancelled','no_show','problem'].includes(status);
  return <form onSubmit={event=>{
    event.preventDefault();
    onSave({id:booking.id,...Object.fromEntries(new FormData(event.currentTarget))});
  }}>
    <fieldset className="status-picker" disabled={busy}>
      <legend>اختار حالة الزيارة</legend>
      <div className="status-options">{Object.entries(statuses).map(([key,label])=>
        <label className={'status-option status-tone status-'+key} key={key}>
          <input type="radio" name="status" value={key} checked={status===key} onChange={()=>setStatus(key)}/>
          <span>{label}</span>
        </label>
      )}</div>
    </fieldset>
    <label>تعليق الإدارة{needsComment?' (مطلوب)':''}
      <textarea name="comment" defaultValue={booking.comment} maxLength={1500} required={needsComment}/>
    </label>
    <p className="muted">اختار الحالة، وبعدها اضغط حفظ لتأكيد التغيير.</p>
    <button className={'status-save status-tone status-'+status} disabled={busy}>
      {busy?'جاري الحفظ…':'حفظ الحالة والتعليق'}
    </button>
  </form>;
}
