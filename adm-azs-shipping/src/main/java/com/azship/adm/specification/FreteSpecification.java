package com.azship.adm.specification;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import com.azship.adm.entity.FormaDeMedida;
import com.azship.adm.entity.Frete;
import com.azship.adm.entity.FreteItem;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;

public class FreteSpecification {

    public static Specification<Frete> build(Long userId, String searchTerm) {
        return (root, query, cb) -> {
            
            Predicate userPredicate = cb.equal(root.get("user").get("id"), userId);

            if (!StringUtils.hasText(searchTerm)) {
                return userPredicate;
            }

            List<Predicate> searchPredicates = new ArrayList<>();
            String likePattern = "%" + searchTerm.toLowerCase() + "%";

            searchPredicates.add(cb.like(cb.lower(root.get("descricao")), likePattern));
            
            searchPredicates.add(cb.like(cb.lower(root.get("observacoes")), likePattern));

            query.distinct(true); 
            
            Join<Frete, FreteItem> itemJoin = root.join("itens", JoinType.LEFT);
            Join<FreteItem, FormaDeMedida> medidaJoin = itemJoin.join("formaDeMedida", JoinType.LEFT);

            searchPredicates.add(cb.like(cb.lower(medidaJoin.get("nome")), likePattern));
            
            searchPredicates.add(cb.like(cb.lower(medidaJoin.get("unidade")), likePattern));

            Predicate searchPredicate = cb.or(searchPredicates.toArray(new Predicate[0]));

            return cb.and(userPredicate, searchPredicate);
        };
    }
}