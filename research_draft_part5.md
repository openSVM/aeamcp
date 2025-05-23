# Chapter 5: Discovery and Querying Mechanisms

## 5.1 On-chain Discovery Approaches

### 5.1.1 Direct PDA Lookups

The most fundamental method for discovering registry entries on-chain is through direct lookups using Program Derived Addresses (PDAs). As discussed in Chapter 2, PDAs are deterministically derived from the program ID and a set of seeds. If a client knows the seeds used to create a specific registry entry, they can derive its PDA and fetch the account data directly.

For the Agent Registry, the PDA is derived using the seeds `[b"agent_registry", agent_id.as_bytes(), owner_authority.key().as_ref()]`. Therefore, if a client knows the `agent_id` and the `owner_authority`, they can find the agent entry:

```typescript
// Client-side code to find a specific agent entry
async function findAgentEntry(
    program: Program<AgentRegistry>,
    agentId: string,
    ownerPublicKey: PublicKey
): Promise<AgentRegistryEntryV1 | null> {
    // Derive the PDA
    const [entryPda] = PublicKey.findProgramAddressSync(
        [
            Buffer.from("agent_registry"),
            Buffer.from(agentId),
            ownerPublicKey.toBuffer()
        ],
        program.programId
    );
    
    try {
        // Fetch the account data
        const entry = await program.account.agentRegistryEntryV1.fetch(entryPda);
        return entry;
    } catch (error) {
        // Handle account not found or other errors
        console.error(`Error fetching agent entry ${entryPda.toString()}:`, error);
        return null;
    }
}
```

Similarly, for the MCP Server Registry, the PDA is derived using the seeds `[b"mcp_server_registry", server_id.as_bytes(), owner_authority.key().as_ref()]`. If a client knows the `server_id` and the `owner_authority`, they can find the server entry:

```typescript
// Client-side code to find a specific MCP server entry
async function findMCPServerEntry(
    program: Program<MCPServerRegistry>,
    serverId: string,
    ownerPublicKey: PublicKey
): Promise<MCPServerRegistryEntryV1 | null> {
    // Derive the PDA
    const [entryPda] = PublicKey.findProgramAddressSync(
        [
            Buffer.from("mcp_server_registry"),
            Buffer.from(serverId),
            ownerPublicKey.toBuffer()
        ],
        program.programId
    );
    
    try {
        // Fetch the account data
        const entry = await program.account.mcpServerRegistryEntryV1.fetch(entryPda);
        return entry;
    } catch (error) {
        // Handle account not found or other errors
        console.error(`Error fetching MCP server entry ${entryPda.toString()}:`, error);
        return null;
    }
}
```

**Advantages:**

1. **Direct and Efficient**: This method is the most direct and efficient way to access a specific entry when all seeds are known.
2. **On-Chain Verification**: The lookup is performed directly against the blockchain state, providing the most up-to-date and verifiable information.
3. **No Indexing Required**: It doesn't rely on any secondary indexing mechanisms.

**Limitations:**

1. **Requires Known Seeds**: This method only works if the client knows all the seeds used to derive the PDA (e.g., `agent_id` and `owner_authority`).
2. **No Filtering or Searching**: It doesn't support searching for entries based on criteria other than the seeds.
3. **Limited Discovery**: It cannot be used to discover unknown agents or servers.

Direct PDA lookups are suitable for scenarios where a client needs to retrieve information about a specific, known entity, such as verifying the details of an agent it intends to interact with or fetching the endpoints of a known MCP server.

### 5.1.2 Secondary Index Traversal

To enable more flexible on-chain querying, the registry protocols can implement secondary indexing patterns, as introduced in Chapter 2. These patterns involve creating additional PDA accounts that serve as indexes, mapping from specific attributes (like owner, capability, or tag) to the primary registry entries.

**Example: Owner Index Traversal**

Let's consider an owner index for the Agent Registry, where index accounts map an owner's public key to the `agent_id`s they own:

```rust
// PDA for owner index
let (owner_index_pda, _) = Pubkey::find_program_address(
    &[
        b"owner_index",
        owner.as_ref(),
    ],
    program_id
);

// Structure for owner index
#[account]
pub struct OwnerIndex {
    pub bump: u8,
    pub owner: Pubkey,
    pub agent_ids: Vec<String>,  // List of agent IDs owned by this owner
}
```

A client can use this index to find all agents owned by a specific authority:

1. **Derive Index PDA**: Derive the PDA for the owner index using the owner's public key.
2. **Fetch Index Data**: Fetch the `OwnerIndex` account data.
3. **Iterate Agent IDs**: Iterate through the `agent_ids` stored in the index.
4. **Derive Entry PDAs**: For each `agent_id`, derive the PDA for the corresponding `AgentRegistryEntryV1` using the `agent_id` and the owner's public key.
5. **Fetch Entry Data**: Fetch the data for each agent entry.

```typescript
// Client-side code to find all agents owned by a specific authority
async function findAgentsByOwner(
    program: Program<AgentRegistry>,
    ownerPublicKey: PublicKey
): Promise<AgentRegistryEntryV1[]> {
    // Derive the owner index PDA
    const [ownerIndexPda] = PublicKey.findProgramAddressSync(
        [
            Buffer.from("owner_index"),
            ownerPublicKey.toBuffer()
        ],
        program.programId
    );
    
    try {
        // Fetch the owner index account
        const ownerIndex = await program.account.ownerIndex.fetch(ownerIndexPda);
        
        const agentEntries: AgentRegistryEntryV1[] = [];
        
        // Iterate through agent IDs
        for (const agentId of ownerIndex.agentIds) {
            // Derive the agent entry PDA
            const [entryPda] = PublicKey.findProgramAddressSync(
                [
                    Buffer.from("agent_registry"),
                    Buffer.from(agentId),
                    ownerPublicKey.toBuffer()
                ],
                program.programId
            );
            
            try {
                // Fetch the agent entry
                const entry = await program.account.agentRegistryEntryV1.fetch(entryPda);
                agentEntries.push(entry);
            } catch (error) {
                console.warn(`Could not fetch agent entry ${entryPda.toString()} for agent ID ${agentId}:`, error);
            }
        }
        
        return agentEntries;
    } catch (error) {
        // Handle owner index not found or other errors
        console.error(`Error fetching owner index ${ownerIndexPda.toString()}:`, error);
        return [];
    }
}
```

Similar indexing patterns can be implemented for other attributes like capabilities, tags, or supported tools.

**Advantages:**

1. **Enhanced Querying**: Enables on-chain querying based on attributes other than the primary seeds.
2. **Decentralized Discovery**: Allows clients to discover entries based on specific criteria without relying on off-chain systems.

**Limitations:**

1. **Complexity**: Adds significant complexity to the program logic, especially for maintaining index consistency during updates and removals.
2. **Storage Costs**: Requires additional on-chain storage for the index accounts, increasing rent costs.
3. **Transaction Costs**: Updating indexes increases the computational cost and size of transactions.
4. **Scalability Issues**: Indexes storing large lists (e.g., many agent IDs) can become large and expensive to manage, potentially exceeding account size limits.
5. **Limited Query Flexibility**: On-chain indexes typically support only simple lookups based on the indexed attribute; complex multi-attribute queries are difficult.

Secondary index traversal is suitable for scenarios where specific, well-defined query patterns must be performed directly on-chain, and the number of entries per index key is expected to be manageable.

### 5.1.3 Performance Considerations

On-chain discovery approaches, while providing direct access to blockchain state, have significant performance considerations:

1. **RPC Node Latency**: Fetching account data involves communication with Solana RPC nodes, which introduces network latency. Fetching multiple accounts sequentially (as in index traversal) can be slow.

2. **RPC Node Limits**: RPC nodes often impose rate limits on requests. Intensive querying, especially using `getProgramAccounts` or fetching many accounts for index traversal, can hit these limits, leading to failed requests.

3. **`getProgramAccounts` Scalability**: The `getProgramAccounts` method, while useful for fetching all accounts of a program, does not scale well. As the number of registry entries grows, the time and resources required to fetch and process all accounts increase significantly. The maximum response size for RPC requests also limits the total number of accounts that can be returned in a single call.

4. **Compute Budget**: While querying itself doesn't consume the client's compute budget, the underlying RPC node operations consume resources. Heavy querying can strain RPC node infrastructure.

5. **Account Size Limits**: Secondary index accounts that store lists of keys (e.g., `OwnerIndex` storing `agent_ids`) can grow large. If an index account exceeds Solana's maximum account size (currently 10MB), it becomes unusable. Even before hitting the hard limit, large accounts are expensive to create and modify.

6. **Transaction Costs for Index Maintenance**: Maintaining secondary indexes requires additional instructions and account accesses within the registration, update, and deregistration transactions. This increases the compute units consumed and the transaction fees for these operations.

```
+---------------------------+     +---------------------------+
|                           |     |                           |
|  Client                   |     |  RPC Node                 |
|                           |     |                           |
|  - Sends RPC request      |---->|  - Processes request      |
|  - Waits for response     |<----|  - Fetches data from      |
|  - Processes data         |     |    validator network      |
|                           |     |  - Applies rate limits    |
|                           |     |  - Returns response       |
|                           |     |                           |
+---------------------------+     +---------------------------+
          | Latency, Rate Limits |                     | Resource Usage
          v                      v                     v
+-------------------------------------------------------------------+
| Performance Bottlenecks in On-Chain Discovery                     |
+-------------------------------------------------------------------+
```

**Optimization Strategies:**

1. **Batch RPC Requests**: Use methods like `getMultipleAccounts` to fetch data for multiple PDAs in a single RPC call, reducing network overhead.

2. **Client-Side Caching**: Cache frequently accessed registry entries or index data on the client-side to reduce redundant RPC calls.

3. **Selective Indexing**: Implement secondary indexes only for the most critical and frequently used query patterns.

4. **Paginated Indexes**: For indexes that might grow large, implement pagination mechanisms (e.g., storing index entries across multiple accounts) to avoid hitting account size limits. This adds significant complexity.

5. **Prioritize Off-Chain Indexing**: For most complex querying and discovery needs, rely primarily on off-chain indexing solutions, which offer better performance and scalability.

Due to these performance considerations, on-chain discovery methods are generally best suited for targeted lookups and simple, low-volume queries. For broader discovery and complex filtering, off-chain indexing is typically the preferred approach.

## 5.2 Off-chain Indexing Infrastructure

### 5.2.1 Event Emission for Indexers

The foundation of efficient off-chain indexing is a robust event emission system within the on-chain registry programs. By emitting events whenever a registry entry is created, updated, or removed, the programs provide a real-time stream of changes that off-chain indexers can consume.

**Event Design:**

Events should be designed to provide sufficient information for indexers to update their databases accurately:

1. **Unique Identifiers**: Include the primary identifier (`agent_id` or `server_id`) and the owner authority to uniquely identify the affected entry.

2. **Key Data Changes**: For update events, include information about which fields were changed or the new values of critical fields.

3. **Timestamps**: Include a timestamp to indicate when the change occurred.

4. **Action Type**: Clearly indicate the type of action (e.g., registered, updated, removed, status changed).

**Agent Registry Events:**

```rust
#[event]
pub struct AgentRegisteredEvent {
    pub agent_id: String,
    pub owner: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct AgentUpdatedEvent {
    pub agent_id: String,
    pub owner: Pubkey,
    pub updated_fields: Vec<String>, // List of field names that changed
    pub timestamp: i64,
}

#[event]
pub struct AgentStatusChangedEvent {
    pub agent_id: String,
    pub owner: Pubkey,
    pub new_status: u8,
    pub timestamp: i64,
}

#[event]
pub struct AgentRemovedEvent {
    pub agent_id: String,
    pub owner: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct AgentOwnershipTransferredEvent {
    pub agent_id: String,
    pub old_owner: Pubkey,
    pub new_owner: Pubkey,
    pub old_pda: Pubkey, // The PDA before transfer (remains the same)
    pub timestamp: i64,
}
```

**MCP Server Registry Events:**

```rust
#[event]
pub struct MCPServerRegisteredEvent {
    pub server_id: String,
    pub owner: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct MCPServerUpdatedEvent {
    pub server_id: String,
    pub owner: Pubkey,
    pub updated_fields: Vec<String>,
    pub timestamp: i64,
}

#[event]
pub struct MCPServerStatusChangedEvent {
    pub server_id: String,
    pub owner: Pubkey,
    pub new_status: u8,
    pub timestamp: i64,
}

#[event]
pub struct MCPServerRemovedEvent {
    pub server_id: String,
    pub owner: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct MCPServerOwnershipTransferredEvent {
    pub server_id: String,
    pub old_owner: Pubkey,
    pub new_owner: Pubkey,
    pub old_pda: Pubkey,
    pub timestamp: i64,
}
```

**Event Emission Implementation:**

Events are emitted within the corresponding instruction handlers using Anchor's `emit!` macro:

```rust
pub fn register_agent(ctx: Context<RegisterAgent>, args: RegisterAgentArgs) -> Result<()> {
    // ... initialize entry ...
    
    emit!(AgentRegisteredEvent {
        agent_id: entry.agent_id.clone(),
        owner: entry.owner_authority,
        timestamp: entry.created_at,
    });
    
    Ok(())
}

pub fn update_agent(ctx: Context<UpdateAgent>, args: UpdateAgentArgs) -> Result<()> {
    // ... update entry ...
    
    emit!(AgentUpdatedEvent {
        agent_id: entry.agent_id.clone(),
        owner: entry.owner_authority,
        updated_fields, // Vector of updated field names
        timestamp: entry.updated_at,
    });
    
    Ok(())
}

pub fn close_agent_entry(ctx: Context<CloseAgentEntry>) -> Result<()> {
    let entry = &ctx.accounts.entry;
    
    emit!(AgentRemovedEvent {
        agent_id: entry.agent_id.clone(),
        owner: entry.owner_authority,
        timestamp: Clock::get()?.unix_timestamp,
    });
    
    // Anchor handles account closure
    Ok(())
}
```

**Benefits of Event Emission:**

1. **Decoupling**: Indexers are decoupled from the internal logic of the registry programs; they only need to consume events.
2. **Real-time Updates**: Events provide a near real-time stream of changes, allowing indexers to stay synchronized with the on-chain state.
3. **Scalability**: Event consumption is generally more scalable than repeatedly querying on-chain state using `getProgramAccounts`.
4. **Reduced On-Chain Load**: Shifts the burden of complex querying from the blockchain to off-chain systems.

By implementing a comprehensive event emission system, the registry protocols provide the necessary foundation for building powerful and efficient off-chain indexing infrastructures.

### 5.2.2 Indexer Architecture

An off-chain indexer is a service that listens for events emitted by the on-chain registry programs, processes these events, and maintains a queryable database that reflects the current state of the registry.

A typical indexer architecture consists of several components:

1. **Event Listener**: Subscribes to the Solana blockchain (via RPC or WebSocket) and listens for events emitted by the specific registry program IDs.

2. **Event Parser**: Decodes the event data (which is typically Borsh-serialized) into a structured format.

3. **State Fetcher**: When an event indicates a change, the indexer may need to fetch the full account data from the blockchain to get the complete, updated state.

4. **Database Adapter**: Transforms the event data and fetched state into a format suitable for the chosen database.

5. **Database**: Stores the indexed registry data. Common choices include:
   - **Relational Databases (e.g., PostgreSQL)**: Good for structured data and complex relational queries.
   - **NoSQL Databases (e.g., MongoDB, Elasticsearch)**: Good for flexible schemas, large datasets, and full-text search.
   - **Graph Databases (e.g., Neo4j)**: Good for modeling relationships between entities.

6. **Query API**: Exposes an API (e.g., REST, GraphQL) that allows clients to query the indexed data.

```
+-------------------+     +-------------------+     +-------------------+     +-------------------+
|                   |     |                   |     |                   |     |                   |
| Solana Blockchain |---->| Event Listener    |---->| Event Parser      |---->| State Fetcher     |
| (Registry Events) |     | (RPC/WebSocket)   |     | (Borsh Decode)    |     | (Fetch Account)   |
|                   |     |                   |     |                   |     |                   |
+-------------------+     +-------------------+     +-------------------+     +-------------------+
                                                                                  |
                                                                                  v
+-------------------+     +-------------------+     +-------------------+     +-------------------+
|                   |     |                   |     |                   |     |                   |
| Client            |<----| Query API         |<----| Database          |<----| Database Adapter  |
| (Web/Mobile/Agent)|     | (REST/GraphQL)    |     | (Postgres/Mongo)  |     | (Data Transform)  |
|                   |     |                   |     |                   |     |                   |
+-------------------+     +-------------------+     +-------------------+     +-------------------+
```

**Indexer Logic:**

The indexer processes events as follows:

1. **Registration Event**: When a `Registered` event is received:
   - Fetch the full account data for the new entry.
   - Insert a new record into the database with the fetched data.

2. **Update Event**: When an `Updated` event is received:
   - Fetch the full account data for the updated entry.
   - Update the corresponding record in the database with the new data.
   - Alternatively, if the event contains sufficient detail about the changes, update only the specified fields.

3. **Removal Event**: When a `Removed` event is received:
   - Delete the corresponding record from the database.

4. **Status Change Event**: When a `StatusChanged` event is received:
   - Update the status field of the corresponding record in the database.

5. **Ownership Transfer Event**: When an `OwnershipTransferred` event is received:
   - Update the owner field of the corresponding record in the database.
   - Potentially update secondary indexes related to ownership.

**Handling Reorganizations:**

Blockchain reorganizations (reorgs), although rare on Solana, can cause events to be reverted. Indexers must handle reorgs gracefully:

1. **Track Block Confirmation**: Process events only after they reach a sufficient confirmation depth.
2. **Store Block Information**: Store the block number or slot associated with each database update.
3. **Rollback Mechanism**: Implement logic to detect reorgs and roll back database changes corresponding to reverted blocks.

**Deployment Considerations:**

1. **High Availability**: Indexers should be deployed with redundancy to ensure continuous operation.
2. **Scalability**: The indexer architecture should be designed to scale horizontally as the number of registry entries and query load increases.
3. **Monitoring**: Implement monitoring and alerting to track indexer health, synchronization lag, and query performance.

Building and maintaining a robust off-chain indexer requires significant infrastructure and operational effort. However, it provides the most flexible and performant solution for complex discovery and querying of registry data.

### 5.2.3 Query API Design

The Query API is the interface through which clients interact with the off-chain indexer to discover and query registry entries. A well-designed API is crucial for usability and performance.

**API Design Principles:**

1. **Flexibility**: Support querying based on a wide range of attributes and combinations.
2. **Performance**: Ensure fast response times, even for complex queries.
3. **Pagination**: Implement pagination for queries that may return large result sets.
4. **Sorting**: Allow results to be sorted based on various criteria (e.g., registration date, name, relevance).
5. **Filtering**: Provide powerful filtering capabilities using logical operators (AND, OR, NOT) and comparison operators (equals, contains, greater than, etc.).
6. **Full-Text Search**: Support full-text search on descriptive fields like name and description.
7. **Versioning**: Version the API to allow for future evolution without breaking existing clients.

**API Technologies:**

Common choices for implementing the Query API include:

1. **REST (Representational State Transfer)**: A widely adopted standard using HTTP methods (GET, POST, etc.) and standard status codes. Simple and well-understood.

2. **GraphQL**: A query language for APIs that allows clients to request exactly the data they need, reducing over-fetching and under-fetching. Offers more flexibility for clients.

**Example API Endpoints (REST):**

**Agent Registry:**

- `GET /agents`: List agents with filtering, sorting, and pagination.
  - Query Parameters: `owner=`, `status=`, `capability=`, `skill_tag=`, `q=` (full-text search), `limit=`, `offset=`, `sort_by=`, `sort_order=`
- `GET /agents/{agent_id}`: Retrieve details for a specific agent by ID (requires owner for disambiguation if IDs are not globally unique, or use PDA).
- `GET /agents/by-pda/{pda}`: Retrieve details for a specific agent by its PDA.

**MCP Server Registry:**

- `GET /mcp-servers`: List MCP servers with filtering, sorting, and pagination.
  - Query Parameters: `owner=`, `status=`, `capability=`, `tool_id=`, `model_id=`, `mcp_version=`, `q=` (full-text search), `limit=`, `offset=`, `sort_by=`, `sort_order=`
- `GET /mcp-servers/{server_id}`: Retrieve details for a specific server by ID (requires owner for disambiguation if IDs are not globally unique, or use PDA).
- `GET /mcp-servers/by-pda/{pda}`: Retrieve details for a specific server by its PDA.

**Example GraphQL Schema:**

```graphql
type Query {
  agents(
    filter: AgentFilterInput
    sort: AgentSortInput
    limit: Int
    offset: Int
  ): [AgentRegistryEntry!]
  
  agent(pda: String!): AgentRegistryEntry
  
  mcpServers(
    filter: MCPServerFilterInput
    sort: MCPServerSortInput
    limit: Int
    offset: Int
  ): [MCPServerRegistryEntry!]
  
  mcpServer(pda: String!): MCPServerRegistryEntry
}

input AgentFilterInput {
  owner: String
  status: Int
  capabilities_mask: String # Bitmask
  skill_tags_contain: [String!]
  name_contains: String
  description_contains: String
  # ... other filter fields
}

input MCPServerFilterInput {
  owner: String
  status: Int
  capabilities_mask: String
  supported_tools_contain: [String!]
  supported_models_contain: [String!]
  supported_mcp_versions_contain: [String!]
  name_contains: String
  description_contains: String
  # ... other filter fields
}

# ... Define AgentRegistryEntry, MCPServerRegistryEntry, and SortInput types
```

**API Response Structure:**

API responses should include:

1. **Data**: The requested registry entries.
2. **Pagination Info**: Total count, limit, offset, and links to previous/next pages.
3. **Metadata**: Timestamp of the last update, API version.

**Security Considerations:**

1. **Rate Limiting**: Implement rate limiting on the API to prevent abuse.
2. **Authentication/Authorization**: Consider adding authentication mechanisms if access needs to be restricted.
3. **Input Validation**: Sanitize and validate all query parameters to prevent injection attacks or excessive resource consumption.

By providing a well-designed Query API, the off-chain indexer enables clients to efficiently discover and query registry entries, unlocking the full potential of the decentralized agent and MCP server ecosystem.

## 5.3 Hybrid Discovery Patterns

### 5.3.1 Combining On-chain and Off-chain Data

Hybrid discovery patterns leverage the strengths of both on-chain and off-chain data sources to provide a comprehensive and trustworthy discovery experience. This approach combines the verifiability of on-chain data with the query flexibility and performance of off-chain indexes.

**Core Principle:**

The core principle is to use the off-chain indexer for initial discovery and filtering based on complex criteria, and then use on-chain lookups to verify critical information and retrieve the most up-to-date state for selected entries.

**Typical Workflow:**

1. **Off-Chain Query**: Client queries the off-chain indexer's API with complex filtering criteria (e.g., find active agents with specific skills and a good reputation score).

2. **Candidate Selection**: The indexer returns a list of candidate PDAs that match the criteria based on its indexed data.

3. **On-Chain Verification**: For the top candidates, the client performs direct PDA lookups on-chain to:
   - Verify the current status (e.g., ensure the agent is still active).
   - Confirm critical attributes (e.g., owner authority, core capabilities).
   - Retrieve the latest service endpoints.

4. **Final Selection**: The client makes a final selection based on the verified on-chain data and potentially other factors like latency testing or cost.

```
+----------+     +-------------------+     +-------------------+     +----------+
|          | 1. Query API        | 2. Candidate PDAs | 3. Fetch Account  |          |
| Client   |-------------------->| Off-Chain Indexer |-------------------->| Solana   |
|          |                     |<--------------------|                     |<----------|
|          |                     |                     | 4. Verified Data  |          |
+----------+                     +-------------------+                     +----------+
     |
     | 5. Select & Interact
     v
+----------+
| Target   |
| Agent/   |
| Server   |
+----------+
```

**Data Synchronization:**

It's crucial that the off-chain index remains closely synchronized with the on-chain state. However, due to potential indexing lag, clients should always treat off-chain data as potentially slightly stale and verify critical information on-chain before initiating important interactions.

**Example Use Case: Finding a Reliable MCP Server**

1. **Off-Chain Query**: Client queries the indexer API for MCP servers that support a specific tool (`tool_id = "web_search"`), have a high reputation score (`rating > 4.5`), and offer a specific pricing tier (`pricing_tier = "pro"`).

2. **Candidate PDAs**: The indexer returns a list of PDAs for servers matching these criteria.

3. **On-Chain Verification**: The client takes the top 3 candidate PDAs and fetches their full entries from the Solana blockchain.
   - Verify `status` is `Active`.
   - Verify `owner_authority` matches expectations (if known).
   - Retrieve the latest `service_endpoints`.
   - Verify the `schema_hash` for the `web_search` tool matches the expected hash.

4. **Final Selection**: The client might perform a quick latency test on the verified endpoints and select the server with the best performance and verified capabilities.

**Benefits:**

1. **Best of Both Worlds**: Combines the query power of off-chain indexes with the trust and timeliness of on-chain data.
2. **Efficiency**: Reduces the load on RPC nodes compared to purely on-chain discovery for complex queries.
3. **Trustworthiness**: Ensures that critical decisions are based on verified, up-to-date on-chain information.

### 5.3.2 Caching Strategies

Caching plays a vital role in optimizing the performance of hybrid discovery patterns by reducing redundant data fetching from both on-chain and off-chain sources.

**Client-Side Caching:**

Clients can implement local caches to store frequently accessed data:

1. **Registry Entry Cache**: Cache the full data for recently accessed or frequently used agent/server entries. Cache entries should include a timestamp and be invalidated based on a Time-To-Live (TTL) or when update events are detected.

2. **Query Result Cache**: Cache the results of common queries made to the off-chain indexer API. Cache keys should incorporate all query parameters (filters, sort, pagination).

3. **Reputation/Attestation Cache**: Cache data retrieved from external reputation or attestation services.

```typescript
// Simple client-side cache implementation
const entryCache = new Map<string, { entry: any, timestamp: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

async function getCachedAgentEntry(
    program: Program<AgentRegistry>,
    pda: PublicKey
): Promise<AgentRegistryEntryV1 | null> {
    const pdaString = pda.toString();
    const cached = entryCache.get(pdaString);
    
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
        console.log(`Cache hit for ${pdaString}`);
        return cached.entry;
    }
    
    console.log(`Cache miss for ${pdaString}, fetching from chain...`);
    try {
        const entry = await program.account.agentRegistryEntryV1.fetch(pda);
        entryCache.set(pdaString, { entry, timestamp: Date.now() });
        return entry;
    } catch (error) {
        console.error(`Error fetching agent entry ${pdaString}:`, error);
        return null;
    }
}
```

**Indexer-Side Caching:**

Off-chain indexers can implement caching at various levels:

1. **API Response Caching**: Cache responses for frequent queries at the API gateway or application level (e.g., using Redis or Memcached).

2. **Database Query Caching**: Utilize database-level caching mechanisms to speed up query execution.

3. **Materialized Views**: Pre-compute and store the results of common aggregations or complex joins in materialized views.

**Cache Invalidation:**

Effective cache invalidation is crucial:

1. **TTL-Based**: Invalidate cache entries after a predefined time period.
2. **Event-Based**: Use the event stream from the blockchain to proactively invalidate cache entries corresponding to updated or removed registry items.
3. **Manual Invalidation**: Allow users or administrators to manually clear caches when necessary.

By implementing appropriate caching strategies, both clients and indexers can significantly improve the performance and efficiency of the discovery process.

### 5.3.3 Real-time Updates

Maintaining real-time or near real-time updates is essential for the reliability of hybrid discovery systems, ensuring that clients have access to the latest information.

**Leveraging WebSockets:**

Solana's WebSocket API allows clients and indexers to subscribe to real-time notifications for various blockchain events:

1. **Account Change Subscriptions**: Subscribe to changes for specific registry entry PDAs. This allows clients to receive immediate notifications when an entry they are interested in is updated.

```typescript
// Subscribe to changes for a specific agent entry PDA
const subscriptionId = connection.onAccountChange(
    agentEntryPda,
    (accountInfo, context) => {
        console.log(`Agent entry ${agentEntryPda.toString()} updated in slot ${context.slot}`);
        const updatedEntry = program.coder.accounts.decode("AgentRegistryEntryV1", accountInfo.data);
        // Update local state or cache
        updateLocalAgentState(agentEntryPda, updatedEntry);
    },
    "confirmed" // Confirmation level
);
```

2. **Program Log Subscriptions**: Subscribe to logs emitted by the registry programs. This allows indexers and clients to receive the event stream in real-time.

```typescript
// Subscribe to logs from the agent registry program
const subscriptionId = connection.onLogs(
    agentRegistryProgramId,
    (logs, context) => {
        if (logs.err) {
            console.error("Error in logs:", logs.err);
            return;
        }
        
        // Parse events from logs
        const events = program.coder.events.parseLogs(logs.logs);
        for (const event of events) {
            console.log(`Received event: ${event.name}`, event.data);
            // Process event for indexing or client updates
            processRegistryEvent(event);
        }
    },
    "confirmed"
);
```

**Indexer Real-time Processing:**

Off-chain indexers should use WebSocket subscriptions to process events as soon as they reach the desired confirmation level. This minimizes the lag between on-chain changes and the indexed state.

**Client Real-time Updates:**

Clients can use WebSocket subscriptions to:

1. **Invalidate Caches**: Immediately invalidate local cache entries when an update event is received for a cached item.
2. **Update UI**: Update user interfaces in real-time to reflect changes in agent/server status or details.
3. **Trigger Actions**: Automatically trigger actions based on real-time events (e.g., switch to a backup server if the primary one becomes inactive).

**Challenges:**

1. **Scalability**: Maintaining a large number of WebSocket connections can be resource-intensive for both clients and RPC nodes.
2. **Reliability**: WebSocket connections can be interrupted; robust reconnection and state synchronization logic is required.
3. **Confirmation Levels**: Choosing the appropriate confirmation level (`processed`, `confirmed`, `finalized`) involves trade-offs between latency and finality.

By effectively utilizing Solana's WebSocket API and designing robust real-time processing logic, hybrid discovery systems can provide clients with timely and accurate information, enhancing the responsiveness and reliability of the overall ecosystem.

---
*References will be compiled and listed in Chapter 13.*
