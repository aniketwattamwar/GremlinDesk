document.addEventListener('DOMContentLoaded', () => {
    const queryInput = document.getElementById('query-input');
    const executeBtn = document.getElementById('execute-btn');
    const jsonOutput = document.getElementById('json-output');
    const dot = document.querySelector('.dot');
    const statusText = document.querySelector('.status-text');

    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`${btn.dataset.tab}-content`).classList.add('active');
        });
    });

    function parseGraphSON(data) {
        if (data === null || data === undefined) return null;
        if (typeof data === 'object' && '@value' in data) {
            const type = data['@type'];
            const val = data['@value'];
            if (type === 'g:List' || type === 'g:Set') return val.map(parseGraphSON);
            if (type === 'g:Map') {
                const map = {};
                for (let i = 0; i < val.length; i += 2) {
                    const k = typeof val[i] === 'object' ? parseGraphSON(val[i]) : val[i];
                    map[k] = parseGraphSON(val[i + 1]);
                }
                return map;
            }
            if (type === 'g:Vertex' || type === 'g:Edge') {
                return { 
                    type: type.replace('g:', ''), 
                    id: parseGraphSON(val.id), 
                    label: val.label, 
                    inV: val.inV ? parseGraphSON(val.inV) : undefined,
                    outV: val.outV ? parseGraphSON(val.outV) : undefined,
                    properties: parseGraphSON(val.properties) || {} 
                };
            }
            if (type === 'g:Path') {
                return {
                    type: 'Path',
                    objects: parseGraphSON(val.objects)
                };
            }
            return val;
        }
        if (Array.isArray(data)) return data.map(parseGraphSON);
        if (typeof data === 'object') {
            const obj = {};
            for (const [k, v] of Object.entries(data)) obj[k] = parseGraphSON(v);
            return obj;
        }
        return data;
    }

    function renderItem(item) {
        if (typeof item !== 'object' || item === null) {
            return `<div class="node-prop"><span class="prop-val">${item}</span></div>`;
        }

        let html = '';
        
        // Handle Paths specifically
        if (item.type === 'Path' && item.objects) {
            html += `<div style="margin-bottom: 8px; font-weight: bold; color: var(--accent-color);">Traversal Path:</div>`;
            html += `<div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">`;
            item.objects.forEach((obj, idx) => {
                if (idx > 0) html += `<span style="color: var(--text-secondary);">➜</span>`;
                html += `<div style="background: rgba(0,0,0,0.2); padding: 8px; border-radius: 6px; border: 1px solid var(--glass-border);">`;
                if (obj.type) {
                    html += `<div style="font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase;">${obj.type}</div>`;
                    html += `<div style="color: var(--text-primary); font-weight: bold;">${obj.label || obj.id || '?'}</div>`;
                } else {
                    html += `<div style="color: var(--text-primary);">${JSON.stringify(obj)}</div>`;
                }
                html += `</div>`;
            });
            html += `</div>`;
            return html;
        }

        // Header for Node / Edge
        if (item.type) {
            let title = item.type;
            if (item.label) title += `: ${item.label}`;
            html += `<h3 style="margin-bottom: 12px; color: var(--accent-hover); border-bottom: 1px solid var(--glass-border); padding-bottom: 6px;">${title} <span style="font-size: 0.8em; color: var(--text-secondary); float: right; font-weight: normal;">id: ${JSON.stringify(item.id)}</span></h3>`;
        }

        // Display properties/fields
        for (const [key, val] of Object.entries(item)) {
            // Skip redundant fields if it's a Vertex/Edge
            if (item.type && (key === 'type' || key === 'id' || key === 'label')) continue;
            
            // Format nested properties nicer if it's just a value map
            if (key === 'properties' && typeof val === 'object' && Object.keys(val).length > 0) {
                for (const [pKey, pVal] of Object.entries(val)) {
                    let pDisplay = Array.isArray(pVal) ? pVal.map(p => typeof p === 'object' ? (p.value || JSON.stringify(p)) : p).join(', ') : (typeof pVal === 'object' ? JSON.stringify(pVal) : pVal);
                    html += `<div class="node-prop"><span class="prop-key">${pKey}</span><span class="prop-val">${pDisplay}</span></div>`;
                }
                continue;
            }
            if (key === 'properties' && typeof val === 'object' && Object.keys(val).length === 0) continue;

            let displayVal = Array.isArray(val) ? val.join(', ') : (typeof val === 'object' ? JSON.stringify(val) : val);
            html += `<div class="node-prop"><span class="prop-key">${key}</span><span class="prop-val">${displayVal}</span></div>`;
        }
        return html;
    }

    function renderView(parsedData) {
        const viewOutput = document.getElementById('view-output');
        viewOutput.innerHTML = '';
        if (!parsedData || (Array.isArray(parsedData) && parsedData.length === 0)) {
            viewOutput.innerHTML = '<div class="empty-state">No results found.</div>';
            return;
        }
        if (!Array.isArray(parsedData)) parsedData = [parsedData];
        
        const MAX_RENDER_ITEMS = 300;
        let isTruncated = false;
        let itemsToRender = parsedData;
        if (parsedData.length > MAX_RENDER_ITEMS) {
            itemsToRender = parsedData.slice(0, MAX_RENDER_ITEMS);
            isTruncated = true;
        }

        itemsToRender.forEach(item => {
            const card = document.createElement('div');
            card.className = 'node-card';
            card.innerHTML = renderItem(item);
            viewOutput.appendChild(card);
        });

        if (isTruncated) {
             const warning = document.createElement('div');
             warning.className = 'node-card';
             warning.style.borderColor = 'var(--accent-hover)';
             warning.innerHTML = `<h3 style="color: var(--accent-hover); margin-bottom: 0;">⚠️ Output Truncated</h3><p style="color: var(--text-secondary); margin-top: 8px;">Showing first ${MAX_RENDER_ITEMS} of ${parsedData.length} results to prevent performance issues. Please use .limit() in your Gremlin query.</p>`;
             viewOutput.appendChild(warning);
        }
    }

    let network = null;

    function renderGraph(parsedData) {
        const container = document.getElementById('vis-network-container');
        if (!parsedData || (Array.isArray(parsedData) && parsedData.length === 0)) {
            if (network) network.destroy();
            network = null;
            container.innerHTML = '<div class="empty-state">No graph results found.</div>';
            return;
        }

        const nodesMap = new Map();
        const edgesMap = new Map();

        function addNode(n) {
            if (!n || n.id === undefined) return;
            const strId = typeof n.id === 'object' ? JSON.stringify(n.id) : String(n.id);
            if (!nodesMap.has(strId)) {
                let label = n.label || strId;
                if (n.properties && n.properties.name) {
                    label = Array.isArray(n.properties.name) ? n.properties.name[0].value || n.properties.name[0] : n.properties.name;
                }
                nodesMap.set(strId, {
                    id: strId,
                    label: String(label),
                    group: n.label || 'default',
                    raw: n
                });
            }
        }

        function addEdge(e) {
            if (!e || e.id === undefined) return;
            const strId = typeof e.id === 'object' ? JSON.stringify(e.id) : String(e.id);
            if (!edgesMap.has(strId) && e.inV !== undefined && e.outV !== undefined) {
                const outVId = typeof e.outV === 'object' ? JSON.stringify(e.outV) : String(e.outV);
                const inVId = typeof e.inV === 'object' ? JSON.stringify(e.inV) : String(e.inV);
                edgesMap.set(strId, {
                    id: strId,
                    from: outVId,
                    to: inVId,
                    label: e.label || '',
                    font: { align: 'middle' },
                    arrows: 'to',
                    raw: e
                });
                
                // Add phantom nodes if they don't exist yet
                if (!nodesMap.has(outVId)) {
                    nodesMap.set(outVId, { id: outVId, label: outVId, raw: { id: e.outV, type: 'Vertex (Reference)' } });
                }
                if (!nodesMap.has(inVId)) {
                    nodesMap.set(inVId, { id: inVId, label: inVId, raw: { id: e.inV, type: 'Vertex (Reference)' } });
                }
            }
        }

        function extractVisData(item) {
            if (!item || typeof item !== 'object') return;
            if (item.type === 'Vertex') {
                addNode(item);
            } else if (item.type === 'Edge') {
                addEdge(item);
            } else if (item.type === 'Path' && item.objects) {
                item.objects.forEach(extractVisData);
            } else {
                Object.values(item).forEach(val => {
                    if (Array.isArray(val)) val.forEach(extractVisData);
                    else if (typeof val === 'object') extractVisData(val);
                });
            }
        }

        let itemsToProcess = Array.isArray(parsedData) ? parsedData : [parsedData];
        if (itemsToProcess.length > 2000) {
            itemsToProcess = itemsToProcess.slice(0, 2000);
        }

        itemsToProcess.forEach(extractVisData);

        if (nodesMap.size === 0 && edgesMap.size === 0) {
            if (network) network.destroy();
            container.innerHTML = '<div class="empty-state" style="color: var(--text-secondary);">No Graph topology (Vertices/Edges) found in results.<br>Check the Cards or JSON tabs for scalar results.</div>';
            return;
        }

        const data = {
            nodes: new vis.DataSet(Array.from(nodesMap.values())),
            edges: new vis.DataSet(Array.from(edgesMap.values()))
        };

        const options = {
            nodes: {
                shape: 'dot',
                size: 16,
                font: { color: '#f8fafc', size: 14, strokeWidth: 2, strokeColor: '#0f172a' },
                borderWidth: 2,
                color: {
                    border: '#1bb56b',
                    background: '#1a1a1a',
                    highlight: { border: '#22d07a', background: '#1bb56b' }
                }
            },
            edges: {
                width: 1.5,
                color: { color: '#64748b', highlight: '#94a3b8' },
                smooth: { type: 'continuous' }
            },
            physics: {
                solver: 'forceAtlas2Based',
                forceAtlas2Based: { gravitationalConstant: -50, centralGravity: 0.01, springLength: 100, springConstant: 0.08 }
            },
            interaction: { hover: true, tooltipDelay: 200 }
        };

        if (network) {
            network.destroy();
        }
        network = new vis.Network(container, data, options);

        network.on("click", function (params) {
            const panel = document.getElementById('property-panel');
            const panelBody = document.getElementById('panel-body');
            const panelTitle = document.getElementById('panel-title');
            
            if (params.nodes.length > 0) {
                const nodeId = params.nodes[0];
                const nodeData = data.nodes.get(nodeId);
                if (nodeData && nodeData.raw) {
                    panelTitle.textContent = 'Vertex Properties';
                    panelBody.innerHTML = renderItem(nodeData.raw);
                    panel.classList.remove('hidden');
                }
            } else if (params.edges.length > 0) {
                const edgeId = params.edges[0];
                const edgeData = data.edges.get(edgeId);
                if (edgeData && edgeData.raw) {
                    panelTitle.textContent = 'Edge Properties';
                    panelBody.innerHTML = renderItem(edgeData.raw);
                    panel.classList.remove('hidden');
                }
            } else {
                panel.classList.add('hidden');
            }
        });
    }

    document.getElementById('close-panel-btn').addEventListener('click', () => {
        document.getElementById('property-panel').classList.add('hidden');
    });

    let ws = null;
    const wsUrl = 'ws://localhost:8182/gremlin';

    function connectWebSocket() {
        try {
            ws = new WebSocket(wsUrl);
            
            ws.onopen = () => {
                dot.classList.remove('disconnected');
                dot.classList.add('connected');
                statusText.textContent = 'Connected (ws://localhost:8182)';
            };

            ws.onclose = () => {
                dot.classList.remove('connected');
                dot.classList.add('disconnected');
                statusText.textContent = 'Disconnected';
                // Try to reconnect after 5 seconds
                setTimeout(connectWebSocket, 5000);
            };

            ws.onerror = (error) => {
                console.error("WebSocket error:", error);
                ws.close();
            };

            ws.onmessage = (event) => {
                try {
                    const response = JSON.parse(event.data);
                    let formatted = JSON.stringify(response, null, 2);
                    if (formatted.length > 250000) {
                        formatted = formatted.substring(0, 250000) + "\n\n... [JSON output truncated at 250KB to prevent UI lag. Use .limit() in your query!] ...";
                    }
                    jsonOutput.textContent = formatted;
                    
                    if (response.status && response.status.code !== 200 && response.status.code !== 204) {
                        const errMsg = response.status.message || "Unknown server error";
                        document.getElementById('view-output').innerHTML = `<div class="node-card" style="border-color: var(--error-color);"><h3 style="color: var(--error-color);">Server Error (${response.status.code})</h3><div style="color: var(--text-primary); font-family: Consolas, monospace; white-space: pre-wrap; margin-top: 10px;">${errMsg}</div></div>`;
                        return;
                    }

                    if (response.result && response.result.data) {
                        const parsed = parseGraphSON(response.result.data);
                        renderView(parsed);
                        renderGraph(parsed);
                    } else {
                        document.getElementById('view-output').innerHTML = '<div class="empty-state">No data returned.</div>';
                        document.getElementById('vis-network-container').innerHTML = '<div class="empty-state">No data returned.</div>';
                    }
                } catch (e) {
                    jsonOutput.textContent = event.data;
                    document.getElementById('view-output').textContent = "Error parsing response.";
                }
            };
        } catch (e) {
            console.error("Failed to setup WebSocket:", e);
        }
    }

    // Initialize connection
    connectWebSocket();

    function executeQuery() {
        const query = queryInput.value.trim();
        if (!query) return;

        jsonOutput.textContent = 'Executing query...';
        document.getElementById('view-output').innerHTML = '<div class="empty-state">Executing query...</div>';
        
        const graphContainer = document.getElementById('vis-network-container');
        if(graphContainer) graphContainer.innerHTML = '<div class="empty-state">Executing query...</div>';
        document.getElementById('property-panel').classList.add('hidden');

        if (ws && ws.readyState === WebSocket.OPEN) {
            // Standard Gremlin Server GraphSON v3 request format
            const request = {
                requestId: crypto.randomUUID(),
                op: 'eval',
                processor: '',
                args: {
                    gremlin: query,
                    bindings: {},
                    language: 'gremlin-groovy'
                }
            };
            ws.send(JSON.stringify(request));
        } else {
            jsonOutput.textContent = 'Error: Not connected to Gremlin Server.';
        }
    }

    executeBtn.addEventListener('click', executeQuery);

    queryInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            executeQuery();
        }
    });
});
