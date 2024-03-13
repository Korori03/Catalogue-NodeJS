function getQuery(object, type) {
    var sql = '';
    switch (object.toLowerCase()) {
        case "books":
            switch (type) {
                case "percent_main":
                    sql = `Call itemPercentage("books",?,?,"main");`;
                    break;
                case "percent_sub":
                    sql = `Call itemPercentage("books",?,?,"subitem");`;
                    break;
                case "last10":
                    sql = `SELECT t.id,
                        case when name like 'The %' then CONCAT(trim(substr(SUBSTRING_INDEX(t.name, ' - ', 1) from 4)), ', The - ',SUBSTRING_INDEX(t.name, ' - ', -1))  else t.name end as name,
                        t.type,
                        t.region
                        FROM books as t
                        INNER JOIN users as u ON u.id = t.userid
                        INNER JOIN viewable as v ON v.userid = t.userid
                        WHERE 
                            LOWER(u.username) = LOWER(?) AND
                            v.books = 'Y' AND
                            t.rating <> 'A'
                        ORDER BY t.purchase_date DESC
                        LIMIT 0, 10;`;
                    break;
                case "item":
                    sql = `Call selectItem("books", ?, ?, ?);`;
                    break;
                case "item_rating":
                    sql = `SELECT 
                                t.comments,
                                t.options,
                                t.total FROM rating as t 
                            INNER JOIN users as u ON u.id = t.userid  
                            WHERE 
                                t.type= ? AND 
                                t.typeid= ? AND 
                               LOWER(u.username) = LOWER(?);`;
                    break;
                case "percent_type":
                    sql = `SELECT  
                            b.id as id,  
                            case when name like 'The %' then CONCAT(trim(substr(SUBSTRING_INDEX(b.name, ' - ', 1) from 4)), ', The - ',SUBSTRING_INDEX(b.name, ' - ', -1))  else b.name end as name,  
                            '' as secondary,  
                            b.publisher as publisher, 
                            b.region as region,   
                            b.barcode as barcode, 
                            b.genre as genre, 
                            IF(b.release_date = '1900-01-01', 'Unknown',DATE_FORMAT(b.release_date,'%m-%d-%Y')) as release_date,  
                            b.rating as rating,   
                            IF(b.finished= 2, 'playing', IF(b.finished= 1, 'completed', 'pending')) as completed,   
                            b.type as type 
                        FROM books as b 
                        INNER JOIN users as u ON u.id = b.userid 
                        INNER JOIN viewable as v ON v.userid = b.userid 
                        WHERE 
                            LOWER(b.type) = LOWER(?) AND 
                            LOWER(u.username) = LOWER(?) 
                        ORDER by 
                            case when name like 'The %' then CONCAT(trim(substr(SUBSTRING_INDEX(b.name, ' - ', 1) from 4)), ', The - ',SUBSTRING_INDEX(b.name, ' - ', -1))  else b.name end ASC;`;
                    break;
                case "type":
                    sql = `SELECT  
                        b.id as id,  
                        case when name like 'The %' then CONCAT(trim(substr(SUBSTRING_INDEX(b.name, ' - ', 1) from 4)), ', The - ',SUBSTRING_INDEX(b.name, ' - ', -1))  else b.name end as name,  
                        '' as secondary,  
                        b.publisher as publisher, 
                        b.region as region,   
                        b.barcode as barcode, 
                        b.genre as genre, 
                        IF(b.release_date = '1900-01-01', 'Unknown',DATE_FORMAT(b.release_date,'%m-%d-%Y')) as release_date,  
                        b.rating as rating,   
                        IF(b.finished= 2, 'playing', IF(b.finished= 1, 'completed', 'pending')) as completed,   
                        b.type as type 
                    FROM books as b 
                    INNER JOIN users as u ON u.id = b.userid 
                    INNER JOIN viewable as v ON v.userid = b.userid 
                    WHERE 
                        LOWER(b.type) = LOWER(?) AND 
                        LOWER(u.username) = LOWER(?) AND
                        b.rating <> 'A'
                    ORDER by 
                        case when name like 'The %' then CONCAT(trim(substr(SUBSTRING_INDEX(b.name, ' - ', 1) from 4)), ', The - ',SUBSTRING_INDEX(b.name, ' - ', -1))  else b.name end ASC;`;
                    break;
            }
            break;
        case "videos":
            switch (type) {
                case "percent_main":
                    sql = `Call itemPercentage("videos",?,?,"main");`;
                    break;
                case "percent_sub":
                    sql = `Call itemPercentage("videos",?,?,"subitem");`;
                    break;
                case "last10":
                    sql = `SELECT 
                            t.id,
                            case when name like 'The %' then CONCAT(trim(substr(SUBSTRING_INDEX(t.name, ' - ', 1) from 4)), ', The - ',SUBSTRING_INDEX(t.name, ' - ', -1))  else t.name end as name,  
                            t.type,
                            t.region 
                            FROM videos as t 
                            INNER JOIN users as u ON u.id = t.userid
                            INNER JOIN viewable as v ON v.userid = t.userid 
                            WHERE LOWER(u.username) = LOWER(?) 
                            AND t.rating <> 'A'
                            ORDER BY t.purchase_date DESC LIMIT 0, 10;`;

                    //sql = `Call LastTen("videos",?,0);`;
                    break;
                case "item":
                    sql = `Call selectItem("videos", ?, ?, ?);`;
                    break;
                case "item_rating":
                    sql = `SELECT 
                                t.comments,
                                t.options,
                                t.total FROM rating as t 
                            INNER JOIN users as u ON u.id = t.userid  
                            WHERE 
                                t.type=? AND 
                                t.typeid=? AND 
                               LOWER(u.username) = LOWER(?);`;
                    break;
                case "percent_type":
                    sql = `SELECT  
                                b.id as id,  
                                case when name like 'The %' then CONCAT(trim(substr(SUBSTRING_INDEX(b.name, ' - ', 1) from 4)), ', The - ',SUBSTRING_INDEX(b.name, ' - ', -1))  else b.name end as name,  
                                '' as secondary,  
                                b.publisher as publisher, 
                                b.region as region,   
                                b.barcode as barcode, 
                                b.genre as genre, 
                                IF(b.release_date = '1900-01-01', 'Unknown',DATE_FORMAT(b.release_date,'%m-%d-%Y')) as release_date,  
                                b.rating as rating,   
                                IF(b.finished= 2, 'playing', IF(b.finished= 1, 'completed', 'pending')) as completed,   
                                b.type as type 
                            FROM videos as b 
                            INNER JOIN users as u ON u.id = b.userid 
                            INNER JOIN viewable as v ON v.userid = b.userid 
                            WHERE 
                                LOWER(b.type) = LOWER(?) AND 
                                LOWER(u.username) = LOWER(?) 
                            ORDER by 
                                case when name like 'The %' then CONCAT(trim(substr(SUBSTRING_INDEX(b.name, ' - ', 1) from 4)), ', The - ',SUBSTRING_INDEX(b.name, ' - ', -1))  else b.name end ASC;`;
                    break;
                case "type":
                    sql = `SELECT  
                            b.id as id,  
                            case when name like 'The %' then CONCAT(trim(substr(SUBSTRING_INDEX(b.name, ' - ', 1) from 4)), ', The - ',SUBSTRING_INDEX(b.name, ' - ', -1))  else b.name end as name,  
                            '' as secondary,  
                            b.publisher as publisher, 
                            b.region as region,   
                            b.barcode as barcode, 
                            b.genre as genre, 
                            IF(b.release_date = '1900-01-01', 'Unknown',DATE_FORMAT(b.release_date,'%m-%d-%Y')) as release_date,  
                            b.rating as rating,   
                            IF(b.finished= 2, 'playing', IF(b.finished= 1, 'completed', 'pending')) as completed,   
                            b.type as type 
                        FROM videos as b 
                        INNER JOIN users as u ON u.id = b.userid 
                        INNER JOIN viewable as v ON v.userid = b.userid 
                        WHERE 
                            LOWER(b.type) = LOWER(?) AND 
                            LOWER(u.username) = LOWER(?) AND
                            b.rating <> 'A'
                        ORDER by 
                            case when name like 'The %' then CONCAT(trim(substr(SUBSTRING_INDEX(b.name, ' - ', 1) from 4)), ', The - ',SUBSTRING_INDEX(b.name, ' - ', -1))  else b.name end ASC;`;
                    break;
            }

            break;
        case "figures":
            switch (type) {
                case "percent_main":
                    sql = `Call itemPercentage("figures",?,?,"main");`;
                    break;
                case "percent_sub":
                    sql = `Call itemPercentage("figures",?,?,"subitem");`;
                    break;
                case "last10":

                    sql = `Call LastTen("figures",?,0);`;
                    break;
                case "item":
                    sql = `Call selectItem("figures", ?, ?, ?);`;
                    break;
                case "item_rating":
                    sql = `SELECT t.comments,t.options,t.total FROM rating as t INNER JOIN users as u ON u.id = t.userid  WHERE t.type=? and t.typeid=? andLOWER(u.username) = LOWER(?);`;
                    break;
                case "percent_type":
                    sql = `SELECT  
                                b.id as id,  
                                case when name like 'The %' then CONCAT(trim(substr(SUBSTRING_INDEX(b.name, ' - ', 1) from 4)), ', The - ',SUBSTRING_INDEX(b.name, ' - ', -1))  else b.name end as name,  
                                '' as secondary,  
                                b.publisher as publisher, 
                                b.region as region,   
                                b.barcode as barcode, 
                                b.genre as genre, 
                                IF(b.release_date = '1900-01-01', 'Unknown',DATE_FORMAT(b.release_date,'%m-%d-%Y')) as release_date,  
                                b.rating as rating,   
                                IF(b.finished= 2, 'playing', IF(b.finished= 1, 'completed', 'pending')) as completed,   
                                b.type as type 
                            FROM figures as b 
                            INNER JOIN users as u ON u.id = b.userid 
                            INNER JOIN viewable as v ON v.userid = b.userid 
                            WHERE 
                                LOWER(b.type) = LOWER(?) AND 
                                LOWER(u.username) = LOWER(?) 
                            ORDER by 
                                case when name like 'The %' then CONCAT(trim(substr(SUBSTRING_INDEX(b.name, ' - ', 1) from 4)), ', The - ',SUBSTRING_INDEX(b.name, ' - ', -1))  else b.name end ASC;`;
                    break;
                case "type":
                    sql = `SELECT  
                            b.id as id,  
                            case when name like 'The %' then CONCAT(trim(substr(SUBSTRING_INDEX(b.name, ' - ', 1) from 4)), ', The - ',SUBSTRING_INDEX(b.name, ' - ', -1))  else b.name end as name,  
                            '' as secondary,  
                            b.publisher as publisher, 
                            b.region as region,   
                            b.barcode as barcode, 
                            b.genre as genre, 
                            IF(b.release_date = '1900-01-01', 'Unknown',DATE_FORMAT(b.release_date,'%m-%d-%Y')) as release_date,  
                            b.rating as rating,   
                            IF(b.finished= 2, 'playing', IF(b.finished= 1, 'completed', 'pending')) as completed,   
                            b.type as type 
                        FROM figures as b 
                        INNER JOIN users as u ON u.id = b.userid 
                        INNER JOIN viewable as v ON v.userid = b.userid 
                        WHERE 
                            LOWER(b.type) = LOWER(?) AND 
                            LOWER(u.username) = LOWER(?)
                        ORDER by 
                            case when name like 'The %' then CONCAT(trim(substr(SUBSTRING_INDEX(b.name, ' - ', 1) from 4)), ', The - ',SUBSTRING_INDEX(b.name, ' - ', -1))  else b.name end ASC;`;
                    break;
            }
            break;
        case "music":
            switch (type) {
                case "percent_main":
                    sql = `Call itemPercentage("music",?,?,"main");`;
                    break;
                case "percent_sub":
                    sql = `Call itemPercentage("music",?,?,"subitem");`;
                    break;
                case "last10":
                    sql = `SELECT 
                                m.id,
                                m.artist,
                                m.album,
                                m.type,
                                m.region,
                                CONCAT(m.album, ' (', m.artist,')') as name 
                                FROM music as m 
                                INNER JOIN users as u ON u.id = m.userid
                                INNER JOIN viewable as v ON v.userid = m.userid 
                                WHERE LOWER(u.username) = LOWER(?)
                                 ORDER BY m.id DESC LIMIT 0, 10;`;
                    //sql = `Call LastTen("music",?,0);`;
                    break;
                case "item":
                    sql = `Call selectItem("music", ?, ?, ?);`;
                    break;
                case "item_rating":
                    sql = `SELECT 
                                t.comments,
                                t.options,
                                t.total FROM rating as t 
                            INNER JOIN users as u ON u.id = t.userid  
                            WHERE 
                                t.type=? and 
                                t.typeid=? and 
                               LOWER(u.username) = LOWER(?);`;
                    break;
                case "type":
                    sql = `SELECT 
                            m.id as id,
                            CONCAT(m.artist ,IF(m.album <> '', CONCAT(' - ',m.album),'')) as name,
                            '' as secondary,
                            m.publisher as publisher,
                            m.region as region,
                            m.barcode as barcode,
                            m.genre as genre,
                            m.release_date as release_date,              
                            '' as rating,
                            '' as completed,
                            'music' as type 
                            FROM music as m
                            INNER JOIN users as u ON u.id = m.userid 
                            INNER JOIN viewable as v ON v.userid = m.userid
                            WHERE 
                            LOWER(m.type) = LOWER(?) AND 
                            LOWER(u.username) = LOWER(?)
                            ORDER by
                            CONCAT(m.artist ,IF(m.album <> '', CONCAT(' - ',m.album),'')) ASC;`;
                    break;
                case "percent_type":
                    sql = `SELECT 
                            m.id as id,
                            CONCAT(m.artist ,IF(m.album <> '', CONCAT(' - ',m.album),'')) as name,
                            '' as secondary,
                            m.publisher as publisher,
                            m.region as region,
                            m.barcode as barcode,
                            m.genre as genre,
                            m.release_date as release_date,              
                            '' as rating,
                            '' as completed,
                            'music' as type 
                            FROM music as m
                            INNER JOIN users as u ON u.id = m.userid 
                            INNER JOIN viewable as v ON v.userid = m.userid
                            WHERE 
                            LOWER(m.type) = LOWER(?) AND 
                            LOWER(u.username) = LOWER(?)
                            ORDER by
                            CONCAT(m.artist ,IF(m.album <> '', CONCAT(' - ',m.album),'')) ASC;`;
                    break;

            }

            break;
        case "tcg":
            switch (type) {
                case "main":
                    sql = `SELECT
                                c.subitem, 	
                                LOWER(replace(c.subitem, ' ', '_')) as url,
                                (SELECT (SUM(s.card_count)+ SUM(s.secret_count) + Sum(s.variant_count)) as total 
                            FROM tcgsets as s 
                            WHERE 
                                LOWER(s.type) = LOWER(replace(c.subitem, ' ', '_'))
                                GROUP BY s.type) as total,
                                (
                                    SELECT  
                                        Count(o.id) As tcgownid 
                                    FROM tcgown as o 
                                    INNER JOIN tcgsets as s ON s.setid = o.setid 
                                    WHERE  
                                        LOWER(s.type) = LOWER(replace(c.subitem, ' ', '_'))
                                ) As own 
                                FROM categories as c WHERE LOWER(c.main) = 'tcg'  
                                ORDER BY c.subitem ASC;`;
                    break;
                case "last10":
                    sql = `Call LastTen("tcg",?,0);`;
                    break;
                case "brand":
                    sql = `SELECT 
                                c.setid,
                                c.abbreviation,
                                c.name,
                                c.type,
                                c.image_symbol,
                                c.date_released,
                                c.card_count,
                                c.secret_count,
                                c.variant_count,
                                (
                                    SELECT  
                                        Count(o.id) As tcgownid 
                                    FROM tcgown as o 
                                    WHERE o.setid = c.setid
                                ) As own, 
                                round((100 / (c.card_count+ c.secret_count + c.variant_count)) * (SELECT  Count(o.id) As tcgownid FROM tcgown as o WHERE   o.setid = c.setid) , 0) AS percentage, 
                                (c.card_count + c.secret_count + c.variant_count) as total 
                            FROM tcgsets as c 
                            WHERE 
                                LOWER(c.type) = ?
                            ORDER BY c.date_released DESC;`;
                    break;
                case "set":
                    sql = `SELECT 
                                s.name as set_name,
                                c.id as cid,
                                c.is_variant,
                                c.cardid,
                                c.image,
                                s.abbreviation,
                                c.name,
                                c.card_variant,
                                c.card_number,
                                c.setid,
                                (
                                    SELECT 
                                        Count(o.id) As tcgownid 
                                    FROM tcgown as o 
                                    WHERE   
                                    (
                                        o.setid = c.setid AND o.cardid = c.cardid
                                    )
                                ) As own 
                            FROM 
                                tcgcards as c JOIN tcgsets as s ON s.setid=c.setid  
                            WHERE 
                                LOWER(s.type) = ? AND 
                                LOWER(s.abbreviation) = ? 
                            ORDER BY c.card_number ASC, is_variant ASC;`;
                    break;
            }
            break;
        case "games":
            switch (type.toLowerCase()) {
                case "percent_main":
                    sql = `Call itemPercentage("games",?,?,"main");`;
                    break;
                case "percent_sub":
                    sql = `Call itemPercentage("games",?,?,"subitem");`;
                    break;
                case "percent_brand":
                    sql = `SELECT 
                                g.userid as userid, 
                                g.brand as type, 
                                g.system as gsystem, 
                                IF(c.release_date IS NULL,0,DATE_FORMAT(c.release_date,'%Y')) AS release_date,
                                SUM(g.region = 'United States') as usa,
                                SUM(g.region = 'Japan') as japan, 
                                SUM(g.region = 'Europe') as europe,
                                SUM(g.region = 'Asia') as asia,
                                SUM(g.region = 'Australia') as australia, 
                                SUM(g.region = 'Korea') as korea,
                                SUM(g.finished = 'Y') as finished,
                                count(g.id) as total, 
                                round(( SUM(g.finished = 'Y')/count(g.id) * 100 ),0) AS percentage 
                            FROM games as g 
                                JOIN categories as c ON LOWER(c.subitem2) = LOWER(g.system) AND LOWER(c.subitem) = LOWER(g.brand) 
                                INNER JOIN users as u ON u.id = g.userid 
                                INNER JOIN viewable as v ON v.userid = g.userid 
                            WHERE 
                                LOWER(g.brand) = LOWER(?) AND	
                                u.username = ? 
                                GROUP BY c.subitem ORDER BY mainsort,subsort ASC;`;
                    break;
                case "brand":
                    sql = `SELECT
                                g.brand as brand, 
                                g.userid as userid, 
                                g.system as gsystem, 
                                IF(c.release_date = '1900-01-01', 'Unknown',DATE_FORMAT(c.release_date,'%m-%d-%Y')) as release_date, 
                                SUM(g.region = 'United States') as usa, 
                                SUM(g.region = 'Japan') as japan, 
                                SUM(g.region = 'Europe') as europe, 
                                SUM(g.region = 'Asia') as asia, 
                                SUM(g.region = 'Australia') as australia,
                                SUM(g.region = 'Korea') as korea, 
                                SUM(g.finished = 'Y') as finished, 
                                count(g.id) as total, 
                                SUM(ROUND(IF(g.box ='Y' AND g.cover='Y', 
                                IF(g.api_info = '' OR g.api_info IS NULL,0.00,JSON_VALUE(g.api_info,'$.cib')), IF(g.api_info = '' OR g.api_info IS NULL,0.00,JSON_VALUE(g.api_info,'$.used'))), 2)) AS price, 
                                round(( SUM(g.finished = 'Y')/count(g.id) * 100 ),0) AS percentage   
                            FROM  games as g 
                                JOIN categories as c ON LOWER(c.subitem2) = LOWER(g.system) AND LOWER(c.subitem) = LOWER(g.brand) 
                                INNER JOIN users as u ON u.id = g.userid INNER JOIN viewable as v ON v.userid = g.userid  
                            WHERE 
                                LOWER(g.brand) = LOWER(?) AND 
                                LOWER(u.username) =  LOWER(?)  AND
                                g.rating <> 'A'

                            GROUP BY g.system ORDER BY c.release_date DESC;`;
                    break;
                case "last10":
                    sql = `SELECT t.id,
                                case when name like 'The %%' then CONCAT(trim(substr(SUBSTRING_INDEX(t.name, ' - ', 1) from 4)), ', The')  else t.name end as name,  
                                t.brand,
                                t.system,
                                t.region,
                                t.system as type 
                                FROM games as t 
                                INNER JOIN users as u ON u.id = t.userid 
                                INNER JOIN viewable as v ON v.userid = t.userid 
                                WHERE LOWER(u.username) = LOWER(?) AND
                                t.rating <> 'A'
                                ORDER BY t.purchase_date DESC LIMIT 0, 10;`;
                    //sql = `Call LastTen("games",?,0);`;
                    break;
                case "system":
                    sql = `SELECT  
                            g.id as id, 
                            case when name like 'The %%' then CONCAT(trim(substr(SUBSTRING_INDEX(g.name, ' - ', 1) from 4)), ', The')  else g.name end as name,  
                            g.brand as brand,  
                            g.system as gsystem,  
                            g.developer as secondary,  
                            g.publisher as publisher,  
                            g.rating as rating, 
                            g.genre as genre,  
                            g.region as region,  
                            g.version as version,  
                            g.playmode as playmode,  
                            IF(g.release_date = '1900-01-01', 'Unknown',DATE_FORMAT(g.release_date,'%m-%d-%Y')) as release_date,  
                            IF(CHAR_LENGTH(g.download) > 0, 'True', 'False') as download,  
                            IF(g.vr = 'Y', 'True', 'False') as virtual_relatity, 
                             IF(g.finished= 'P', 'playing', 
                            IF(g.finished= 'Y', 'Completed', 'Pending')) as completed,  
                            IF(g.box = 'Y', 'True', 'False') as box, 
                            IF(g.instructions = 'Y', 'True', 'False') as instructions, 
                            IF(g.cover = 'Y', 'True', 'False') as cover, 
                            IF(g.steelbook = 'Y', 'True', 'False') as steelbook 
                            FROM games as g 
                            JOIN categories as c ON LOWER(c.subitem2) = LOWER(g.system) AND  LOWER(c.subitem) = LOWER(g.brand) 
                            INNER JOIN users as u ON u.id = g.userid  
                            INNER JOIN viewable as v ON v.userid = g.userid  
                            WHERE 
                                LOWER(g.brand) = LOWER(?) AND 
                                LOWER(g.system) = LOWER(?) AND 
                                u.username = ? 
                            ORDER BY 
                                case when name like 'The %%' then CONCAT(trim(substr(SUBSTRING_INDEX(g.name, ' - ', 1) from 4)), ', The - ',SUBSTRING_INDEX(g.name, ' - ', -1))  else g.name end 
                            ASC`;
                    break;
                case "percent_system":
                    sql = `SELECT  
                                ROUND(SUM(JSON_VALUE(g.api_info, '$.used')),2) as cost,
                                g.brand as type, 
                                g.system as gsystem,  
                                IF(c.release_date IS NULL,0,DATE_FORMAT(c.release_date,'%Y')) AS release_date,
                                SUM(g.region = 'United States') as usa, 
                                SUM(g.region = 'Japan') as japan,  
                                SUM(g.region = 'Europe') as europe,  
                                SUM(g.region = 'Asia') as asia,  
                                SUM(g.region = 'Australia') as australia,  
                                SUM(g.region = 'Korea') as korea,  
                                SUM(g.finished = 'Y') as finished,  
                                count(g.id) as total, round(( SUM(g.finished = 'Y')/count(g.id) * 100 ),0) AS percentage  
                            FROM games as g  
                                JOIN categories as c ON LOWER(c.subitem2) = LOWER(g.system) AND   LOWER(c.subitem) = LOWER(g.brand) 
                                INNER JOIN users as u ON u.id = g.userid  
                                INNER JOIN viewable as v ON v.userid = g.userid  
                            WHERE 
                                LOWER(g.brand) = LOWER(?) AND 
                                LOWER(g.system) = LOWER(?) AND 
                                LOWER(u.username) = LOWER(?)  
                            GROUP BY c.subitem  
                            ORDER BY mainsort,subsort ASC;`;
                    break;
                case "item":
                    sql = `Call selectItem("games", ?, ?, ?);`;
                    break;
                case "item_rating":
                    sql = `SELECT 
                                t.comments,
                                t.options,
                                t.total FROM rating as t 
                            INNER JOIN users as u ON u.id = t.userid  
                            WHERE 
                                t.type=? and 
                                t.typeid=? and 
                               LOWER(u.username) = LOWER(?);`;
                    break;
            }
            break;
    }
    return sql;
}

module.exports = { getQuery }
