# Redis listener 
### Listen from source redis and SET to target redis

## Check key event listener on source redis with CLI
CONFIG GET notify-keyspace-events
### Expect response
`
1) "notify-keyspace-events"
2) "KEA"
`

## Set key event listener (KEA) on redis source
CONFIG SET notify-keyspace-events KEA