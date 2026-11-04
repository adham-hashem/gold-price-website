import { ImageResponse } from 'next/og';
export const alt = 'Egypt Gold — Gold prices, calculators and market information';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ width:'100%',height:'100%',background:'#123c31',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'80px',color:'#f6f1df' }}><div style={{ display:'flex',flexDirection:'column',maxWidth:'700px' }}><div style={{ fontSize:22,color:'#d3b270',letterSpacing:6 }}>EGYPT GOLD</div><div style={{ fontSize:70,marginTop:26,fontWeight:700 }}>A clearer view of gold.</div><div style={{ fontSize:26,color:'#b9cdbe',marginTop:28 }}>Gold prices in Egypt · EGP</div><div style={{ fontSize:23,color:'#d3b270',marginTop:28 }}>24K · 22K · 21K · 18K · 14K</div></div><div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:260,width:170,borderRadius:20,border:'4px solid #e6c577',background:'linear-gradient(135deg,#b78c36,#f2d791,#ba8f3f)',color:'#78551c',fontSize:82,transform:'rotate(-12deg)' }}>Au</div></div>, size);
}
