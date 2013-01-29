# Snakeskin

Snakeskin -- компилятор блочных шаблонов c поддержкой наследования.
Независим от среды исполнения, для работы нужен лишь интерпретатор JavaScript.

## Области декларации шаблонов

Шаблоны можно описывать в файлах с расширением `.cc` или же в блоках `<script type="text/x-snakeskin-template">...</script>` (если нужна live компиляция шаблона, например, для отладки).
В одной области может быть объявлено неограниченное количество шаблонов.

## Синтаксис блоков

Управляющие конструкции шаблонизатора размещаются между `{` и `}`.

## Комментарии

В любом месте области декларации шаблонов допускается использовать однострочные (`//`) и многострочные (`/* ... */`)
комментарии.

## Объявления шаблона

Простой шаблон без входных параметров.

    {template myTemplate()}
        Тело шаблона
    {/end}

Простой шаблон без входных параметров объявленный в пространстве имён.

    {template myTpl.myTemplate()}
        Тело шаблона
    {/end}

Шаблон с 2-мя входными параметрами, причём один из них имеет значение по умолчанию.

    {template myTemplate(a = 1, b)}
        Тело шаблона
    {/end}

Шаблон, который наследует функционал другого шаблона.

    {template nextTemplate(a, b) extends myTemplate}
        Тело шаблона
    {/end}

## Константы внутри шаблона

В любом месте внутри шаблона можно объявить константы, после определение константы будет невозможным поменять её значение
или создать новую с таким же именем. Константа может принимать любое валидное JavaScript значение.
Входные параметры шаблона также являются константами.

    {a = 1}
    {b = [{a: 1}, 2, 3]}
    {c = someFunction()}

## Вывод значений

Для вывода значений констант в шаблон используется следующий синтаксис `{a}`.
На выводимую константу можно накладывать фильтры.

    // Пример применения фильтров,
    // dateFormat вызывается после pretyUrl и принимает 2 входных параметра
    {a|pretyUrl|dateFormat 'd.m.y', 'utc'}
    
    // Выражение c фильтром
    {(a + f)|round}

Чтобы написать свой фильтр, достаточно добавить его в `Snakeskin.Filters`.
Первым параметром функции будет значение константы.

По умолчанию при выводе констант к ним применяется фильтр html (экранирование html символов),
однако его выполнение можно отменить `{a|!html}`.

## Условия

    {if a === 1}
        ...
    {elseIf a == 3}
        ...
    {else}
        ...
    {/end}
    
    {if (b == 4 || c == 4) && a == 4}
        {if g == 4}
           ...
        {/end}
    {/end}

## Циклы

Для итерации по массивам и объектам используется оператор `forEach`,
локальные константы могут объявляться после `=>` (опционально).
Для массивов список входны параметров следующий:
значение элемента, номер итерации, является ли элемент первым, является ли элемент последним, длина массива.
Для объектов:
значение элемента, ключ, номер итерации, является ли элемент первым, является ли элемент последним, длина объекта.

    {forEach a => el, i}
        {forEach el}
        {/el}
    {/end}
    
## Конструкция with

Конструкция задаёт область видимости для извлечения константы.

    {with a.child}
        {a} // a.child.a
        {with a.next}
            {a} // a.child.a.next.a
        {/end}
    {/end}

## Конструкция console

Это просто возжность использовать console api отладчика.

    {console.log(a)}

## Конструкция cdata

Данная конструкция вырезается при обработке парсером, а затем вставляется без изменений в результирующую функцию.
    
    // Блоки внутри cdata не будут обработаны парсером
    {cdata}
        {if a = 1}
        {/end}
    {/cdata}

## Наследования шаблонов

Наследование реализовано с помощью оператора block и переопределении констант.
Уровень вложенности наследования не ограничен. Входные параметры шаблона наследуются в случае,
если их указать при декларации (если этого не сделать, то они просто станут локальными константами),
значение по умолчанию также наследуется.

    {template base(a = 2)}
        {e = 1}
        
        <!doctype html>
        <html>
            <head>
                {block head}
                    <title>
                        {block title}
                        {/end}
                    </title>
                {/end}
            </head>
            
            {block footer}
            {/end}
        </html>
    {/end}
    
    // Переопределим значение по умолчанию у константы a
    {template child(a = 3, l = 'my') extends base}
         // Переопределим константу e
         {e = 4}
         // Добавим новую константу j
         // (добавится после всех наследуемых констант)
         {j = 4}
         
         // Переопределим блок title
         {block title}
            Заголовок
         {/end}
         
         // Новые блоки добавляются в конец
         // (кроме новых вложенных блоков)
         {block end}
         {/end}
    {/end}

## Дополнительно

Символы табуляции автоматически вырезаются парсером (кроме блоков cdata), символы новой строки вырезаются везде.

## Как компилировать и что подключать

Для компиляции файла шаблонов, нужно просто запустить compiler.js: `node compiler myTemplates.ss`.
Скомпилированный файл сохранится в папке с myTemplates.ss, как myTemplates.ss.js, однако можно вручную указать имя:
`node compiler myTemplates.ss ../result.js`.

Флаг --commonjs указывает, что скомпилированные функции должны быть декларированы, как свойства exports
`node compiler myTemplates.ss --commonjs ../result.js`.

Для работы скомпилированного шаблона, необходимо также подключить snakeskin.live.js (или snakeskin.live.min.js).

Для live в компиляции в браузере необходимо подключать snakeskin.js (или snakeskin.min.js) и пользоваться методом
compile, который принимает ссылку на DOM узел или текст шаблонов.

Скомпилированные шаблоны вызываются как простые JavaScript функции и принимают указанные в шаблоне параметры.
