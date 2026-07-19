"use client";

import { useState } from "react";
import Link from "next/link";
import type { ResourceRecord } from "../modeling-data";

const all = "全部";

export function ResourceCatalog({ resources }: { resources: ResourceRecord[] }) {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState(all);
  const [category, setCategory] = useState(all);
  const [problemType, setProblemType] = useState(all);
  const [limit, setLimit] = useState(40);

  const years = [...new Set(resources.flatMap((item) => item.year ? [item.year] : []))].sort((a, b) => b - a);
  const categories = [...new Set(resources.map((item) => item.category))];
  const problemTypes = [...new Set(resources.map((item) => item.problemType))];

  const needle = query.trim().toLocaleLowerCase("zh-CN");
  const filtered = resources.filter((item) => {
    const searchable = `${item.title} ${item.summary} ${item.collection} ${item.problem ?? ""}`.toLocaleLowerCase("zh-CN");
    return (!needle || searchable.includes(needle))
      && (year === all || item.year === Number(year))
      && (category === all || item.category === category)
      && (problemType === all || item.problemType === problemType);
  });

  const visible = filtered.slice(0, limit);
  const reset = () => { setQuery(""); setYear(all); setCategory(all); setProblemType(all); setLimit(40); };
  const showPapers = () => { setQuery(""); setYear(all); setCategory("优秀论文"); setProblemType(all); setLimit(40); };

  return (
    <div className="catalog-shell">
      <div className="catalog-controls" role="search" aria-label="筛选数学建模资料">
        <label className="search-field"><span>关键词</span><input value={query} onChange={(event) => { setQuery(event.target.value); setLimit(40); }} placeholder="论文编号、论文题目、算法……" /></label>
        <label><span>年份</span><select value={year} onChange={(event) => { setYear(event.target.value); setLimit(40); }}><option>{all}</option>{years.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label><span>内容类型</span><select value={category} onChange={(event) => { setCategory(event.target.value); setLimit(40); }}><option>{all}</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label><span>问题类型</span><select value={problemType} onChange={(event) => { setProblemType(event.target.value); setLimit(40); }}><option>{all}</option>{problemTypes.map((item) => <option key={item}>{item}</option>)}</select></label>
      </div>
      <div className="catalog-status" aria-live="polite"><p>找到 <strong>{filtered.length}</strong> 条资料，当前显示 {visible.length} 条</p><div><button type="button" onClick={showPapers}>只看优秀论文</button><button type="button" onClick={reset}>清除筛选</button></div></div>
      {filtered.length ? (
        <div className="resource-list">
          {visible.map((item) => (
            <article key={item.id}>
              <div className="resource-year">{item.year ?? "通用"}</div>
              <div className="resource-main"><div className="resource-tags"><span>{item.category}</span>{item.paperCode ? <span>{item.paperCode}</span> : null}<span>{item.problemType}</span><span>{item.format}</span></div><h2>{item.title}</h2><p>{item.summary}</p><small>{item.collection}</small></div>
              <div className="availability"><span>{item.availability}</span><p>{item.paperCode ?? (item.problem ? `${item.problem} 题` : "资料集合")}</p>{item.viewerAvailable ? <Link className="paper-read-link" href={`/papers/${item.id}`}>在线阅读</Link> : item.category === "优秀论文" ? <small>全文校验中</small> : null}</div>
            </article>
          ))}
          {visible.length < filtered.length ? <div className="load-more"><button type="button" onClick={() => setLimit((value) => value + 40)}>继续显示后 40 条</button><span>剩余 {filtered.length - visible.length} 条</span></div> : null}
        </div>
      ) : (
        <div className="empty-state"><strong>没有符合条件的资料</strong><p>减少一个筛选条件，或尝试搜索年份、论文编号和内容类型。</p><button type="button" onClick={reset}>查看全部资料</button></div>
      )}
    </div>
  );
}
