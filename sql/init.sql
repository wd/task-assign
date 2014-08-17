drop table if exists task_assignments;
drop table if exists tasks;
drop table if exists peoples;
drop table if exists project_managers;

create table project_managers (
       id bigserial primary key,
       name varchar(20)
);

create table peoples (
       id bigserial primary key,
       name varchar(20)
);

create table tasks (
       id bigserial primary key,
       task_no varchar(20),
       name varchar(50),
       pm_id bigint REFERENCES project_managers(id),
       qa_date date,
       release_date date,
       notes varchar(50)
);


create table task_assignments (
       id bigserial primary key,
       task_id bigint REFERENCES tasks(id),
       people_id bigint REFERENCES peoples(id),
       start_date date,
       end_date date
);

insert into project_managers ( name ) values ( '王冬' ) , ('测试pm'), ('test' );

insert into peoples (name) values ( '王冬' ), ('测试'), ('test');

insert into tasks values
        ( default, 'Q-T-2345', 'Just a test task', (select id from project_managers where name  ='王冬' ), '2014-08-05', '2014-08-10', null ),
        ( default, null, 'An other task', (select id from project_managers where name  ='test' ), '2014-08-08', '2014-08-14', null );

insert into task_assignments values
       ( default, (select id from tasks where name = 'Just a test task'), (select id from peoples where name = '王冬'), '2014-08-04', '2014-08-10' ),
       ( default, (select id from tasks where name = 'An other task'), (select id from peoples where name = '测试'), '2014-08-04', '2014-08-10' );
