import { supabase } from './lib/supabase';

const KEY='veste_store_v1';
const categories=['Feminino','Masculino','Calçados','Acessórios','Moda Casual','Moda Social'];
const base=[['Vestido Aurora','Feminino','149.90','189.90'],['Tênis Urban','Calçados','249.90','299.90'],['Bolsa Luna','Acessórios','179.90','219.90'],['Camisa Essential','Masculino','129.90','159.90'],['Óculos Solar','Acessórios','99.90','139.90'],['Jaqueta Street','Moda Casual','299.90','349.90']];
const images=['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=900&q=80'];
const defaultSettings={storeName:'VESTES!',city:'Rio Branco',state:'Acre',country:'Brasil',address:'Rua Rosa de Saron, 12, Bairro Universitário, Rio Branco - AC, CEP 69917-728',phone:'(68) 99952-3282',heroTitle:'Seu estilo começa aqui.',heroText:'Descubra roupas, calçados e acessórios para transformar seu estilo em cada ocasião.',about:'Moda para vestir, confiança para escolher.'};
function seed(){return base.map((p,i)=>({id:String(i+1),name:p[0],category:p[1],price:Number(p[3]),salePrice:Number(p[2]),stock:25+i*4,sku:`VST-${String(i+1).padStart(4,'0')}`,image:images[i%images.length],active:true,featured:i<4,new:i<3}))}
export function getData(){try{const raw=localStorage.getItem(KEY);if(raw){const d=JSON.parse(raw);d.settings={...defaultSettings,...d.settings};return d}}catch{} const data={products:seed(),categories,settings:defaultSettings};saveData(data);return data}
export function saveData(data){try{localStorage.setItem(KEY,JSON.stringify(data))}catch{}}
export function resetData(){localStorage.removeItem(KEY);location.reload()}
export {KEY};

export async function fetchRemoteData(){
  if(!supabase) return null;
  const [{data:cats,error:catError},{data:rows,error:productError},{data:settings},{data:content}] = await Promise.all([
    supabase.from('categories').select('id,name,sort_order').eq('active',true).order('sort_order'),
    supabase.from('products').select('id,name,price,sale_price,stock,sku,active,featured,is_new,category_id').eq('active',true).order('created_at',{ascending:false}),
    supabase.from('site_settings').select('*').eq('id',1).maybeSingle(),
    supabase.from('site_content').select('key,value')
  ]);
  if(catError || productError) throw catError || productError;
  const ids=(rows||[]).map(p=>p.id);
  let images=[];
  if(ids.length){const r=await supabase.from('product_images').select('product_id,url,is_primary,sort_order').in('product_id',ids).order('sort_order');images=r.data||[];}
  const catMap=Object.fromEntries((cats||[]).map(c=>[c.id,c.name]));
  const imageMap={};images.forEach(i=>{if(!imageMap[i.product_id]||i.is_primary)imageMap[i.product_id]=i.url});
  const get=(key)=>((content||[]).find(x=>x.key===key)?.value||{});
  const hero=get('hero'),about=get('about'),fallback=getData();
  const institutional={brandIntro:get('brand_intro'),who:get('who_we_are'),story:get('our_story'),mission:get('mission'),vision:get('vision'),values:get('values'),clothing:get('clothing_shoes'),retail:get('retail'),wholesale:get('wholesale'),why:get('why_veste'),contact:get('contact_cta')};
  return {products:(rows||[]).map(p=>({id:p.id,name:p.name,category:catMap[p.category_id]||'Moda',price:Number(p.price),salePrice:p.sale_price==null?null:Number(p.sale_price),stock:p.stock,sku:p.sku||'',image:imageMap[p.id]||fallback.products[0]?.image,active:p.active,featured:p.featured,new:p.is_new})),categories:(cats||[]).map(c=>c.name),settings:{...fallback.settings,storeName:settings?.store_name||fallback.settings.storeName,city:settings?.city||fallback.settings.city,state:settings?.state||fallback.settings.state,address:settings?.address||fallback.settings.address,phone:settings?.phone||fallback.settings.phone,heroTitle:hero.title||fallback.settings.heroTitle,heroText:hero.description||fallback.settings.heroText,about:about.title||fallback.settings.about},institutional};
}
