import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const style = html.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? '';
const hero = html.match(/<section class="hero"[^>]*>([\s\S]*?)<\/section>/)?.[1] ?? '';

function sectionIndex(id) {
  const index = html.indexOf(`id="${id}"`);
  assert.notEqual(index, -1, `#${id} section is missing`);
  return index;
}

assert.match(
  hero,
  /<h1[^>]*>I build data systems that survive production\.<\/h1>/,
  'the opening should lead with a specific engineering point of view',
);
assert.match(
  hero,
  /class="hero-personal"/,
  'the hero should introduce Jhon as a person, not only as a service provider',
);
assert.match(
  hero,
  /Jhon Lucas · Founder &amp; Data\/AI Engineering Consultant/,
  'the hero should connect Jhon to the Data Citizen consultancy',
);
assert.equal(
  (hero.match(/class="hero-primary"/g) ?? []).length,
  1,
  'the hero should have one dominant call to action',
);

const sectionOrder = ['work', 'experience', 'services', 'references', 'about', 'archive', 'contact'];
for (let index = 1; index < sectionOrder.length; index += 1) {
  assert(
    sectionIndex(sectionOrder[index - 1]) < sectionIndex(sectionOrder[index]),
    `#${sectionOrder[index - 1]} should appear before #${sectionOrder[index]}`,
  );
}

assert.equal(
  (html.match(/class="case-study"/g) ?? []).length,
  3,
  'selected work should be curated to exactly three case studies',
);
const selectedWork = html.match(/<section id="work"[\s\S]*?<\/section>/)?.[0] ?? '';
for (const title of [
  'Uniswap V3 Event Streamer',
  'Marketplace Data Lakehouse',
  'Data Pipeline Factory',
]) {
  assert.match(
    selectedWork,
    new RegExp(`<h3>${title}<\\/h3>`),
    `selected work should include ${title}`,
  );
}
assert.equal(
  (html.match(/class="engagement-row"/g) ?? []).length,
  3,
  'consulting services should be presented as three engagement formats',
);
assert.equal(
  (html.match(/class="reference-quote"/g) ?? []).length,
  4,
  'the page should include every available collaborator reference',
);

assert.doesNotMatch(
  style,
  /radial-gradient|backdrop-filter/,
  'the visual system should avoid glowing and glassmorphic effects',
);
assert.doesNotMatch(
  html,
  /class="(?:fact-pill|tech-tag|recommendation-avatar)"/,
  'proof, technology, and reference content should not be rendered as decorative pills or avatars',
);
assert.match(
  style,
  /--radius:\s*4px/,
  'the editorial visual system should use restrained corners',
);

assert.match(
  html,
  /href="mailto:jhon@datacitizen\.xyz">jhon@datacitizen\.xyz<\/a>/,
  'the visible contact address and mail link should use the Data Citizen domain',
);
assert.match(
  html,
  /<title>Data Citizen \| Data &amp; AI Engineering<\/title>/,
  'the browser title should lead with the consultancy brand',
);
assert.match(
  html,
  /class="wordmark"[^>]*>[\s\S]*?<span>Data Citizen<\/span>/,
  'the header wordmark should lead with Data Citizen',
);
assert.match(
  html,
  /class="wordmark"[^>]*>[\s\S]*?<img src="images\/data-citizen-symbol\.png"[^>]*class="wordmark-symbol"/,
  'the compact header should use the simplified Data Citizen symbol',
);
assert.match(
  html,
  /Data Citizen, founded by Jhon Lucas/,
  'the footer should explain the relationship between the brand and founder',
);
assert.match(
  html,
  /<img src="images\/data-citizen-logo-transparent\.png" alt="Data Citizen logo" class="footer-brand-logo">/,
  'the footer should retain the complete established Data Citizen logo',
);

console.log('layout policy checks passed');
