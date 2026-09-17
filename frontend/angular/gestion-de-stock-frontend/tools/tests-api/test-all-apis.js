/**
 * Test de consommation de toutes les API utilisees par le frontend.
 * Usage : node tools/tests-api/test-all-apis.js
 * Prerequis : backend sur :8081, entreprise + admin existants.
 * Le login/mot de passe sont passables en arguments (par defaut : compte de test).
 */
const http = require('http');

const HOST = '127.0.0.1';
const PORT = 8081;
const LOGIN = process.argv[2] || 'contact@maboutique.com';
const PASSWORD = process.argv[3] || 'NouveauMdp2026!';
const DATE = new Date().toISOString().replace('T', ' ').slice(0, 19);

let token = null;
let results = [];
let created = {}; // ids crees pour le menage

function req(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body === undefined ? null : JSON.stringify(body);
    const headers = { 'Content-Type': 'application/json' };
    if (data) headers['Content-Length'] = Buffer.byteLength(data);
    if (token) headers['Authorization'] = 'Bearer ' + token;
    const r = http.request({ host: HOST, port: PORT, path, method, headers }, res => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(b); } catch (e) { /* non JSON */ }
        resolve({ status: res.statusCode, json, body: b });
      });
    });
    r.on('error', reject);
    if (data) r.write(data);
    r.end();
  });
}

async function test(nom, method, path, body, checks) {
  const res = await req(method, path, body);
  let ok = res.status < 500; // par defaut : pas de crash serveur
  let detail = '';
  if (checks) {
    try { detail = checks(res) || ''; } catch (e) { ok = false; detail = 'CHECK KO: ' + e.message; }
  }
  results.push({ nom, method, path, status: res.status, ok, detail });
  console.log((ok ? 'PASS' : 'FAIL') + ' | ' + res.status + ' | ' + nom + (detail ? ' | ' + detail : ''));
  return res;
}

(async () => {
  // ---------- AUTHENTIFICATION ----------
  const auth = await req('POST', '/api/v1/authentification/connexion', { login: LOGIN, password: PASSWORD });
  if (auth.status !== 200) {
    console.log('IMPOSSIBLE DE SE CONNECTER avec ' + LOGIN + ' : ' + auth.status + ' ' + auth.body.slice(0, 150));
    process.exit(1);
  }
  token = auth.json.accessToken;
  console.log('=== Authentification OK (JWT recu) ===\n');

  const me = await req('GET', '/api/v1/utilisateurs/email/' + encodeURIComponent(LOGIN));
  const admin = me.json;
  await test('GET utilisateurs/email (profil login)', 'GET', '/api/v1/utilisateurs/email/' + encodeURIComponent(LOGIN), undefined,
    r => r.json && r.json.id ? 'user id=' + r.json.id : 'pas de user');

  // ---------- CATEGORIES ----------
  const cat = await test('POST categories (creation)', 'POST', '/api/v1/categories', {
    code: 'CAT-TEST-' + Date.now(), designation: 'Categorie test E2E', idEntreprise: admin.entreprise.id
  }, r => r.json && r.json.id ? 'id=' + (created.categorie = r.json.id) : 'pas d id');
  await test('GET categories (liste)', 'GET', '/api/v1/categories', undefined,
    r => Array.isArray(r.json) ? r.json.length + ' categories' : 'pas une liste');
  await test('GET categories/{id}', 'GET', '/api/v1/categories/' + created.categorie, undefined,
    r => r.json && r.json.id === created.categorie ? 'trouvee' : 'mismatch');
  await test('GET categories/code/{code}', 'GET', '/api/v1/categories/code/' + encodeURIComponent(cat.json.code), undefined,
    r => r.json && r.json.id === created.categorie ? 'trouvee par code' : 'mismatch');
  await test('POST categories (modification meme id)', 'POST', '/api/v1/categories',
    Object.assign({}, cat.json, { designation: 'Categorie modifiee' }), r => r.json.designation === 'Categorie modifiee' ? 'modifiee' : 'pas modifiee');

  // ---------- ARTICLES ----------
  const art = await test('POST articles (creation)', 'POST', '/api/v1/articles', {
    codeArticle: 'ART-TEST-' + Date.now(), designation: 'Souris sans fil Logitech',
    prixUnitaireHt: 19.99, tauxTva: 20, prixUnitaireTtc: 23.99,
    category: { id: created.categorie }, idEntreprise: admin.entreprise.id
  }, r => r.json && r.json.id ? 'id=' + (created.article = r.json.id) : 'pas d id');
  await test('GET articles (liste)', 'GET', '/api/v1/articles', undefined,
    r => Array.isArray(r.json) ? r.json.length + ' articles' : 'pas une liste');
  await test('GET articles/{id}', 'GET', '/api/v1/articles/' + created.article, undefined,
    r => r.json && r.json.id === created.article ? 'trouve' : 'mismatch');
  await test('GET articles/code/{code}', 'GET', '/api/v1/articles/code/' + encodeURIComponent(art.json.codeArticle), undefined,
    r => r.json && r.json.id === created.article ? 'trouve par code' : 'mismatch');
  await test('GET categories/{id}/articles', 'GET', '/api/v1/categories/' + created.categorie + '/articles', undefined,
    r => Array.isArray(r.json) && r.json.some(a => a.id === created.article) ? 'article rattache a la categorie' : 'article absent');
  await test('POST articles (modification)', 'POST', '/api/v1/articles',
    Object.assign({}, art.json, { designation: 'Souris sans fil Logitech MX' }), r => /MX$/.test(r.json.designation) ? 'modifie' : 'pas modifie');
  await test('GET articles/{id}/historique-ventes', 'GET', '/api/v1/articles/' + created.article + '/historique-ventes', undefined,
    r => Array.isArray(r.json) ? r.json.length + ' lignes' : 'pas une liste');

  // ---------- CLIENTS ----------
  const clt = await test('POST clients (creation)', 'POST', '/api/v1/clients', {
    nom: 'Dupont', prenom: 'Marie', mail: 'marie.dupont@clients.fr', numTel: '0677889900',
    adresse: { adresse1: '8 rue des Lilas', ville: 'Lyon', codePostale: '69003', pays: 'France' },
    idEntreprise: admin.entreprise.id
  }, r => r.json && r.json.id ? 'id=' + (created.client = r.json.id) : 'pas d id');
  await test('GET clients (liste)', 'GET', '/api/v1/clients', undefined,
    r => Array.isArray(r.json) ? r.json.length + ' clients' : 'pas une liste');
  await test('GET clients/{id}', 'GET', '/api/v1/clients/' + created.client, undefined,
    r => r.json && r.json.id === created.client ? 'trouve' : 'mismatch');

  // ---------- FOURNISSEURS ----------
  const frs = await test('POST fournisseurs (creation)', 'POST', '/api/v1/fournisseurs', {
    nom: 'Grossiste Pro', prenom: 'Paul', mail: 'paul@grossiste-pro.fr', numTel: '0144556677',
    adresse: { adresse1: '22 zone industrielle', ville: 'Lille', codePostale: '59000', pays: 'France' },
    idEntreprise: admin.entreprise.id
  }, r => r.json && r.json.id ? 'id=' + (created.fournisseur = r.json.id) : 'pas d id');
  await test('GET fournisseurs (liste)', 'GET', '/api/v1/fournisseurs', undefined,
    r => Array.isArray(r.json) ? r.json.length + ' fournisseurs' : 'pas une liste');
  await test('GET fournisseurs/{id}', 'GET', '/api/v1/fournisseurs/' + created.fournisseur, undefined,
    r => r.json && r.json.id === created.fournisseur ? 'trouve' : 'mismatch');

  // ---------- COMMANDES CLIENTS ----------
  const cmdClt = await test('POST commandes-clients (creation avec ligne)', 'POST', '/api/v1/commandes-clients', {
    code: 'CMDCLT-TEST-' + Date.now(), dateCommande: new Date().toISOString(), etatCommande: 'EN_PREPARATION',
    client: { id: created.client }, idEntreprise: admin.entreprise.id,
    ligneCommandeClients: [{ article: { id: created.article }, quantite: 5, prixUnitaire: 23.99, idEntreprise: admin.entreprise.id }]
  }, r => r.json && r.json.id ? 'id=' + (created.cmdClt = r.json.id) : 'pas d id');
  await test('GET commandes-clients (liste)', 'GET', '/api/v1/commandes-clients', undefined,
    r => Array.isArray(r.json) ? r.json.length + ' commandes' : 'pas une liste');
  await test('GET commandes-clients/{id}', 'GET', '/api/v1/commandes-clients/' + created.cmdClt, undefined,
    r => r.json && r.json.id === created.cmdClt ? 'trouvee' : 'mismatch');
  await test('GET commandes-clients/code/{code}', 'GET', '/api/v1/commandes-clients/code/' + encodeURIComponent(cmdClt.json.code), undefined,
    r => r.json && r.json.id === created.cmdClt ? 'trouvee par code' : 'mismatch');
  await test('GET commandes-clients/{id}/lignes', 'GET', '/api/v1/commandes-clients/' + created.cmdClt + '/lignes', undefined,
    r => Array.isArray(r.json) && r.json.length === 1 ? '1 ligne' : r.json.length + ' lignes');
  const lignes = (await req('GET', '/api/v1/commandes-clients/' + created.cmdClt + '/lignes')).json;
  const idLigne = lignes[0].id;
  await test('PATCH commandes-clients/.../quantite', 'PATCH', '/api/v1/commandes-clients/' + created.cmdClt + '/lignes/' + idLigne + '/quantite/8', undefined,
    r => r.status === 200 ? 'quantite modifiee' : 'KO');
  await test('PATCH commandes-clients/{id}/etat VALIDEE', 'PATCH', '/api/v1/commandes-clients/' + created.cmdClt + '/etat/VALIDEE', undefined,
    r => r.json && r.json.etatCommande === 'VALIDEE' ? 'etat=VALIDEE' : 'etat pas modifie');

  // ---------- COMMANDES FOURNISSEURS ----------
  const cmdFrs = await test('POST commandes-fournisseurs (creation avec ligne)', 'POST', '/api/v1/commandes-fournisseurs', {
    code: 'CMDFRS-TEST-' + Date.now(), dateCommande: new Date().toISOString(), etatCommande: 'EN_PREPARATION',
    fournisseur: { id: created.fournisseur }, idEntreprise: admin.entreprise.id,
    ligneCommandeFournisseurs: [{ article: { id: created.article }, quantite: 50, prixUnitaire: 12.5, idEntreprise: admin.entreprise.id }]
  }, r => r.json && r.json.id ? 'id=' + (created.cmdFrs = r.json.id) : 'pas d id');
  await test('GET commandes-fournisseurs (liste)', 'GET', '/api/v1/commandes-fournisseurs', undefined,
    r => Array.isArray(r.json) ? r.json.length + ' commandes' : 'pas une liste');
  await test('GET commandes-fournisseurs/{id}', 'GET', '/api/v1/commandes-fournisseurs/' + created.cmdFrs, undefined,
    r => r.json && r.json.id === created.cmdFrs ? 'trouvee' : 'mismatch');
  const lignesFrs = (await req('GET', '/api/v1/commandes-fournisseurs/' + created.cmdFrs + '/lignes')).json;
  await test('GET commandes-fournisseurs/{id}/lignes', 'GET', '/api/v1/commandes-fournisseurs/' + created.cmdFrs + '/lignes', undefined,
    r => Array.isArray(r.json) && r.json.length === 1 ? '1 ligne' : r.json.length + ' lignes');
  await test('PATCH commandes-fournisseurs/{id}/etat VALIDEE', 'PATCH', '/api/v1/commandes-fournisseurs/' + created.cmdFrs + '/etat/VALIDEE', undefined,
    r => r.json && r.json.etatCommande === 'VALIDEE' ? 'etat=VALIDEE' : 'etat pas modifie');

  // ---------- MOUVEMENTS DE STOCK ----------
  await test('POST mouvements-stock/entree', 'POST', '/api/v1/mouvements-stock/entree',
    { article: { id: created.article }, quantite: 30, dateMvt: new Date().toISOString(), typeMvt: 'ENTREE', idEntreprise: admin.entreprise.id },
    r => r.status === 200 ? 'entree OK' : 'KO');
  await test('GET mouvements-stock/articles/{id} (historique)', 'GET', '/api/v1/mouvements-stock/articles/' + created.article, undefined,
    r => Array.isArray(r.json) ? r.json.length + ' mouvements' : 'pas une liste');
  const stock = await test('GET mouvements-stock/articles/{id}/stock-reel', 'GET', '/api/v1/mouvements-stock/articles/' + created.article + '/stock-reel', undefined,
    r => typeof r.json === 'number' ? 'stock reel = ' + r.json : 'pas un nombre');
  await test('POST mouvements-stock/sortie', 'POST', '/api/v1/mouvements-stock/sortie',
    { article: { id: created.article }, quantite: 2, dateMvt: new Date().toISOString(), typeMvt: 'SORTIE', idEntreprise: admin.entreprise.id },
    r => r.status === 200 ? 'sortie OK' : 'KO');
  await test('POST mouvements-stock/correction-positive', 'POST', '/api/v1/mouvements-stock/correction-positive',
    { article: { id: created.article }, quantite: 1, dateMvt: new Date().toISOString(), typeMvt: 'CORRECTION_POS', idEntreprise: admin.entreprise.id },
    r => r.status === 200 ? 'correction+ OK' : 'KO');
  await test('POST mouvements-stock/correction-negative', 'POST', '/api/v1/mouvements-stock/correction-negative',
    { article: { id: created.article }, quantite: 1, dateMvt: new Date().toISOString(), typeMvt: 'CORRECTION_NEG', idEntreprise: admin.entreprise.id },
    r => r.status === 200 ? 'correction- OK' : 'KO');

  // ---------- VENTES ----------
  const vte = await test('POST ventes (creation avec ligne)', 'POST', '/api/v1/ventes', {
    code: 'VTE-TEST-' + Date.now(), dateVente: new Date().toISOString(), commentaire: 'Vente comptoir test',
    idEntreprise: admin.entreprise.id,
    ligneVentes: [{ article: { id: created.article }, quantite: 2, prixUnitaire: 23.99, idEntreprise: admin.entreprise.id }]
  }, r => r.json && r.json.id ? 'id=' + (created.vente = r.json.id) : 'pas d id');
  await test('GET ventes (liste)', 'GET', '/api/v1/ventes', undefined,
    r => Array.isArray(r.json) ? r.json.length + ' ventes' : 'pas une liste');
  await test('GET ventes/{id}', 'GET', '/api/v1/ventes/' + created.vente, undefined,
    r => r.json && r.json.id === created.vente ? 'trouvee' : 'mismatch');
  await test('GET ventes/code/{code}', 'GET', '/api/v1/ventes/code/' + encodeURIComponent(vte.json.code), undefined,
    r => r.json && r.json.id === created.vente ? 'trouvee par code' : 'mismatch');
  await test('GET articles/{id}/historique-ventes (apres vente)', 'GET', '/api/v1/articles/' + created.article + '/historique-ventes', undefined,
    r => Array.isArray(r.json) && r.json.length >= 1 ? r.json.length + ' lignes de vente' : 'vide');

  // ---------- UTILISATEURS / ENTREPRISES ----------
  const usr = await test('POST utilisateurs (creation)', 'POST', '/api/v1/utilisateurs', {
    nom: 'Employe', prenom: 'Test', email: 'employe.test.' + Date.now() + '@maboutique.com',
    moteDePasse: 'Employe2026!', dateDeNaissance: '1995-06-15T00:00:00Z',
    adresse: { adresse1: '5 rue du Travail', ville: 'Paris', codePostale: '75011', pays: 'France' },
    entreprise: { id: admin.entreprise.id }
  }, r => r.json && r.json.id ? 'id=' + (created.utilisateur = r.json.id) : 'pas d id');
  await test('GET utilisateurs (liste)', 'GET', '/api/v1/utilisateurs', undefined,
    r => Array.isArray(r.json) ? r.json.length + ' utilisateurs' : 'pas une liste');
  await test('GET utilisateurs/{id}', 'GET', '/api/v1/utilisateurs/' + created.utilisateur, undefined,
    r => r.json && r.json.id === created.utilisateur ? 'trouve' : 'mismatch');
  await test('GET entreprises/{id}', 'GET', '/api/v1/entreprises/' + admin.entreprise.id, undefined,
    r => r.json && r.json.id === admin.entreprise.id ? 'entreprise trouvee' : 'mismatch');
  await test('GET entreprises (liste)', 'GET', '/api/v1/entreprises', undefined,
    r => Array.isArray(r.json) ? r.json.length + ' entreprises' : 'pas une liste');

  // ---------- NETTOYAGE (DELETE) ----------
  await test('DELETE ventes/{id}', 'DELETE', '/api/v1/ventes/' + created.vente);
  await test('DELETE commandes-fournisseurs/{id}', 'DELETE', '/api/v1/commandes-fournisseurs/' + created.cmdFrs);
  await test('DELETE commandes-clients/{id}', 'DELETE', '/api/v1/commandes-clients/' + created.cmdClt);
  await test('DELETE articles/{id}', 'DELETE', '/api/v1/articles/' + created.article);
  await test('DELETE categories/{id}', 'DELETE', '/api/v1/categories/' + created.categorie);
  await test('DELETE clients/{id}', 'DELETE', '/api/v1/clients/' + created.client);
  await test('DELETE fournisseurs/{id}', 'DELETE', '/api/v1/fournisseurs/' + created.fournisseur);
  await test('DELETE utilisateurs/{id}', 'DELETE', '/api/v1/utilisateurs/' + created.utilisateur);

  // ---------- BILAN ----------
  const pass = results.filter(r => r.ok).length;
  const fails = results.filter(r => !r.ok);
  console.log('\n========== BILAN : ' + pass + '/' + results.length + ' PASS ==========');
  fails.forEach(f => console.log('FAIL ' + f.status + ' ' + f.nom + ' ' + f.method + ' ' + f.path + (f.detail ? ' | ' + f.detail : '')));
  process.exit(0);
})().catch(e => { console.log('ERREUR GLOBALE:', e.message); process.exit(1); });
