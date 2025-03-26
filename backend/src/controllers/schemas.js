const schemas = `

contact_actions
┌───────────────────────┬────────────────────────────┬──────────────────────────┬───────────────────┐
│column_name            │ data_type                  │ character_maximum_length │ numeric_precision │
├───────────────────────┼────────────────────────────┼──────────────────────────┼───────────────────┤
│'id'                   │ 'character'                │ 36                       │ null              │
│'message'              │ 'character varying'        │ 255                      │ null              │
│'dispatch_date'        │ 'timestamp with time zone' │ null                     │ null              │
│'status'               │ 'integer'                  │ null                     │ 32                │
│'whatsapp_template'    │ 'character varying'        │ 512                      │ null              │
│'channel_id'           │ 'integer'                  │ null                     │ 32                │
│'email_template_id'    │ 'character'                │ 36                       │ null              │
│'contact_field'        │ 'character varying'        │ 255                      │ null              │
│'customers_to_contact' │ 'integer'                  │ null                     │ 32                │
│'contacted_customers'  │ 'integer'                  │ null                     │ 32                │
│'prompt_name'          │ 'character varying'        │ 255                      │ null              │
│'voice_id'             │ 'integer'                  │ null                     │ 32                │
│'createdAt'            │ 'timestamp with time zone' │ null                     │ null              │
│'updatedAt'            │ 'timestamp with time zone' │ null                     │ null              │
│'deletedAt'            │ 'timestamp with time zone' │ null                     │ null              │
└───────────────────────┴────────────────────────────┴──────────────────────────┴───────────────────┘

customers
┌───────────────────────────┬────────────────────────────┬──────────────────────────┬───────────────────┐
│ column_name               │ data_type                  │ character_maximum_length │ numeric_precision │
├───────────────────────────┼────────────────────────────┼──────────────────────────┼───────────────────┤
│ 'id'                      │ 'character'                │ 36                       │ null              │
│ 'customer_id'             │ 'character varying'        │ 255                      │ null              │
│ 'account_number'          │ 'character varying'        │ 100                      │ null              │
│ 'name'                    │ 'character varying'        │ 255                      │ null              │
│ 'father_last_name'        │ 'character varying'        │ 255                      │ null              │
│ 'mother_last_name'        │ 'character varying'        │ 255                      │ null              │
│ 'phone'                   │ 'character varying'        │ 20                       │ null              │
│ 'phone2'                  │ 'character varying'        │ 20                       │ null              │
│ 'whatsapp'                │ 'character varying'        │ 20                       │ null              │
│ 'email'                   │ 'character varying'        │ 255                      │ null              │
│ 'balance_due'             │ 'double precision'         │ null                     │ 53                │
│ 'promotion'               │ 'character varying'        │ 45                       │ null              │
│ 'days_past_due'           │ 'integer'                  │ null                     │ 32                │
│ 'payment_due_date'        │ 'date'                     │ null                     │ null              │
│ 'field1'                  │ 'character varying'        │ 255                      │ null              │
│ 'field2'                  │ 'character varying'        │ 255                      │ null              │
│ 'field3'                  │ 'character varying'        │ 255                      │ null              │
│ 'field4'                  │ 'character varying'        │ 255                      │ null              │
│ 'field5'                  │ 'character varying'        │ 255                      │ null              │
│ 'field6'                  │ 'character varying'        │ 255                      │ null              │
│ 'lada_time_zone'          │ 'integer'                  │ null                     │ 32                │
│ 'is_in_debt'              │ 'boolean'                  │ null                     │ null              │
│ 'payment_commitment_date' │ 'date'                     │ null                     │ null              │
│ 'payment_promise_date'    │ 'date'                     │ null                     │ null              │
│ 'createdAt'               │ 'timestamp with time zone' │ null                     │ null              │
│ 'updatedAt'               │ 'timestamp with time zone' │ null                     │ null              │
│ 'deletedAt'               │ 'timestamp with time zone' │ null                     │ null              │
└───────────────────────────┴────────────────────────────┴──────────────────────────┴───────────────────┘

attempts
This table stores the data related to the calling attempts wether they were successful or not and at the
end it's classified according to the "typifications" field which indicates what happened during the call
┌────────────────────────┬────────────────────────────┬──────────────────────────┬───────────────────┐
│ column_name            │ data_type                  │ character_maximum_length │ numeric_precision │
├────────────────────────┼────────────────────────────┼──────────────────────────┼───────────────────┤
│ 'id'                   │ 'character'                │ 36                       │ null              │
│ 'try'                  │ 'integer'                  │ null                     │ 32                │
│ 'action_channel'       │ 'character varying'        │ 45                       │ null              │
│ 'message'              │ 'character varying'        │ 255                      │ null              │
│ 'action_status'        │ 'character varying'        │ 45                       │ null              │
│ 'typification'         │ 'character varying'        │ 255                      │ null              │
│ 'call_actual_duration' │ 'double precision'         │ null                     │ 53                │
│ 'call_duration'        │ 'bigint'                   │ null                     │ 64                │
│ 'g_it_call_id'         │ 'character varying'        │ 45                       │ null              │
│ 'twilio_call_sid'      │ 'character varying'        │ 255                      │ null              │
│ 'sg_message_id'        │ 'character varying'        │ 255                      │ null              │
│ 'w_message_id'         │ 'character varying'        │ 255                      │ null              │
│ 'customer_id'          │ 'character'                │ 36                       │ null              │
│ 'contact_action_id'    │ 'character'                │ 36                       │ null              │
│ 'createdAt'            │ 'timestamp with time zone' │ null                     │ null              │
│ 'updatedAt'            │ 'timestamp with time zone' │ null                     │ null              │
│ 'deletedAt'            │ 'timestamp with time zone' │ null                     │ null              │
└────────────────────────┴────────────────────────────┴──────────────────────────┴───────────────────┘

assignment_file_history
┌──────────────────┬────────────────────────────┬──────────────────────────┬───────────────────┐
│ column_name      │ data_type                  │ character_maximum_length │ numeric_precision │
├──────────────────┼────────────────────────────┼──────────────────────────┼───────────────────┤
│ 'id'             │ 'character'                │ 36                       │ null              │
│ 'name'           │ 'character varying'        │ 255                      │ null              │
│ 'size'           │ 'character varying'        │ 45                       │ null              │
│ 'path'           │ 'character varying'        │ 255                      │ null              │
│ 'mimetype'       │ 'character varying'        │ 45                       │ null              │
│ 'file_via_id'    │ 'integer'                  │ null                     │ 32                │
│ 'file_status_id' │ 'integer'                  │ null                     │ 32                │
│ 'createdAt'      │ 'timestamp with time zone' │ null                     │ null              │
│ 'updatedAt'      │ 'timestamp with time zone' │ null                     │ null              │
│ 'deletedAt'      │ 'timestamp with time zone' │ null                     │ null              │
└──────────────────┴────────────────────────────┴──────────────────────────┴───────────────────┘

file_status
┌─────────────┬────────────────────────────┬──────────────────────────┬───────────────────┐
│ column_name │ data_type                  │ character_maximum_length │ numeric_precision │
├─────────────┼────────────────────────────┼──────────────────────────┼───────────────────┤
│ 'id'        │ 'integer'                  │ null                     │ 32                │
│ 'status'    │ 'character varying'        │ 60                       │ null              │
│ 'createdAt' │ 'timestamp with time zone' │ null                     │ null              │
│ 'updatedAt' │ 'timestamp with time zone' │ null                     │ null              │
│ 'deletedAt' │ 'timestamp with time zone' │ null                     │ null              │
└─────────────┴────────────────────────────┴──────────────────────────┴───────────────────┘

messages_voicebot
This table stores the transcription of all the calls, each record represents a response sent either by the user or the voicebot
┌───────────────────┬────────────────────────────┬──────────────────────────┬───────────────────┐
│ column_name       │ data_type                  │ character_maximum_length │ numeric_precision │
├───────────────────┼────────────────────────────┼──────────────────────────┼───────────────────┤
│ 'id'              │ 'integer'                  │ null                     │ 32                │
│ 'message'         │ 'text'                     │ null                     │ null              │
│ 'conversation_id' │ 'character'                │ 32                       │ null              │
│ 'transmitter'     │ 'character varying'        │ 30                       │ null              │
│ 'createdAt'       │ 'timestamp with time zone' │ null                     │ null              │
│ 'updatedAt'       │ 'timestamp with time zone' │ null                     │ null              │
│ 'deletedAt'       │ 'timestamp with time zone' │ null                     │ null              │
└───────────────────┴────────────────────────────┴──────────────────────────┴───────────────────┘

voicebot_history_logs
┌───────────────┬────────────────────────────┬──────────────────────────┬───────────────────┐
│ column_name   │ data_type                  │ character_maximum_length │ numeric_precision │
├───────────────┼────────────────────────────┼──────────────────────────┼───────────────────┤
│ 'id'          │ 'character'                │ 36                       │ null              │
│ 'request'     │ 'json'                     │ null                     │ null              │
│ 'status_code' │ 'integer'                  │ null                     │ 32                │
│ 'response'    │ 'json'                     │ null                     │ null              │
│ 'url'         │ 'character varying'        │ 255                      │ null              │
│ 'attempt_id'  │ 'character'                │ 36                       │ null              │
│ 'createdAt'   │ 'timestamp with time zone' │ null                     │ null              │
│ 'updatedAt'   │ 'timestamp with time zone' │ null                     │ null              │
│ 'deletedAt'   │ 'timestamp with time zone' │ null                     │ null              │
└───────────────┴────────────────────────────┴──────────────────────────┴───────────────────┘

conversations_voicebot_bridge
┌─────────────┬─────────────┬──────────────────────────┬───────────────────┐
│ column_name │ data_type   │ character_maximum_length │ numeric_precision │
├─────────────┼─────────────┼──────────────────────────┼───────────────────┤
│ 'id'        │ 'character' │ 36                       │ null              │
│ 'date'      │ 'date'      │ null                     │ null              │
│ 'createdAt' │ 'date'      │ null                     │ null              │
│ 'updatedAt' │ 'date'      │ null                     │ null              │
│ 'deletedAt' │ 'date'      │ null                     │ null              │
└─────────────┴─────────────┴──────────────────────────┴───────────────────┘

conversations_voicebot
┌────────────────┬────────────────────────────┬──────────────────────────┬───────────────────┐
│ column_name    │ data_type                  │ character_maximum_length │ numeric_precision │
├────────────────┼────────────────────────────┼──────────────────────────┼───────────────────┤
│ 'id'           │ 'character'                │ 32                       │ null              │
│ 'campaign'     │ 'character varying'        │ 50                       │ null              │
│ 'phone_number' │ 'character varying'        │ 15                       │ null              │
│ 'typification' │ 'character varying'        │ 255                      │ null              │
│ 'createdAt'    │ 'timestamp with time zone' │ null                     │ null              │
│ 'updatedAt'    │ 'timestamp with time zone' │ null                     │ null              │
│ 'deletedAt'    │ 'timestamp with time zone' │ null                     │ null              │
└────────────────┴────────────────────────────┴──────────────────────────┴───────────────────┘

calling_list
┌─────────────────────┬────────────────────────────┬──────────────────────────┬───────────────────┐
│ column_name         │ data_type                  │ character_maximum_length │ numeric_precision │
├─────────────────────┼────────────────────────────┼──────────────────────────┼───────────────────┤
│ 'id'                │ 'character'                │ 36                       │ null              │
│ 'try'               │ 'integer'                  │ null                     │ 32                │
│ 'action_status'     │ 'character varying'        │ 45                       │ null              │
│ 'typification'      │ 'character varying'        │ 255                      │ null              │
│ 'customer_id'       │ 'character'                │ 36                       │ null              │
│ 'contact_action_id' │ 'character'                │ 36                       │ null              │
│ 'createdAt'         │ 'timestamp with time zone' │ null                     │ null              │
│ 'updatedAt'         │ 'timestamp with time zone' │ null                     │ null              │
│ 'deletedAt'         │ 'timestamp with time zone' │ null                     │ null              │
└─────────────────────┴────────────────────────────┴──────────────────────────┴───────────────────┘

calling_list_history_logs
┌───────────────────┬────────────────────────────┬──────────────────────────┬───────────────────┐
│ column_name       │ data_type                  │ character_maximum_length │ numeric_precision │
├───────────────────┼────────────────────────────┼──────────────────────────┼───────────────────┤
│ 'id'              │ 'character'                │ 36                       │ null              │
│ 'request'         │ 'json'                     │ null                     │ null              │
│ 'status_code'     │ 'integer'                  │ null                     │ 32                │
│ 'response'        │ 'json'                     │ null                     │ null              │
│ 'url'             │ 'character varying'        │ 255                      │ null              │
│ 'calling_list_id' │ 'character'                │ 36                       │ null              │
│ 'createdAt'       │ 'timestamp with time zone' │ null                     │ null              │
│ 'updatedAt'       │ 'timestamp with time zone' │ null                     │ null              │
│ 'deletedAt'       │ 'timestamp with time zone' │ null                     │ null              │
└───────────────────┴────────────────────────────┴──────────────────────────┴───────────────────┘

conversations_analysis
This table stores the results of an analysis ran on the records of the calls,
it stores the grade obtained and an explanation of the analysis in JSON format,
this table is also known as "qa","interacciones evaluadas","notas","califaciones" and "analisis",
obtainedGrade is a string in the form "X/Y"
where X is the grade obtained and Y is the maximum grade
agentName is the name of the agent who made the call
customerName is the name of the customer who received the call
fileName is the name of the audio file that contains the call
┌─────────────────────┬────────────────────────────┬──────────────────────────┬
│ column_name         │ data_type                  │ character_maximum_length │
├─────────────────────┼────────────────────────────┼──────────────────────────┼
│ id                  │ character varying          │ 50                       │
│ campaign            │ character varying          │ 255                      │
│ analysisResult      │ text                       │ null                     │
│ obtainedGrade       │ character varying          │ 20                       │
│ createdAt           │ timestamp with time zone   │ null                     │
│ updatedAt           │ timestamp with time zone   │ null                     │
│ fileName            │ character varying          │ 200                      │
│ customerName        │ character varying          │ 80                       │
│ agentName           │ character varying          │ 80                       │
│ deletedAt           │ timestamp with time zone   │ null                     │
└─────────────────────┴────────────────────────────┴──────────────────────────┴

agentName: 'Juan Carlos',
customerName: 'Luis',
fileName: '2e80675ae0554a14b195495877bcb06d-REd4b77c5ac1c864df14c2a6986c74b227.mp3',
`

module.exports = {
    schemas
}