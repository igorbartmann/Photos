import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from "@angular/core";
import { Subject } from "rxjs";
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit, OnDestroy {
    @Input() value: string = '';
    @Output() onTyping: EventEmitter<string> = new EventEmitter<string>();
    debounce: Subject<string> = new Subject<string>();

    ngOnInit() {
        this.debounce
            .pipe(debounceTime(300))
            .subscribe(cmpFilterValue => this.onTyping.emit(cmpFilterValue));
    }

    // Ao utilizar o debounce (Subject), pelo fato do subscribe não finalizar a operação, é necessário darmos um unsubscribe ao fechar o componente.
    // Isto não é necessário ao fazermos subscribe em uma requisição, pois a mesma já é fechada após ter sido feita.
    ngOnDestroy(): void {
        this.debounce.unsubscribe();
    }
}