--cuanto se llama cada evento por usuario
select
    useraccount_id,
    event.event,
    count(1) c
from app.event
group by useraccount_id, event.event
order by c desc;